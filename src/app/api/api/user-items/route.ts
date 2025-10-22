import { NextRequest } from "next/server";
import { db } from "~/server/db";
import { gameItems } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";

// Get all user-created items
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userItems = await db
      .select()
      .from(gameItems)
      .where(
        and(
          eq(gameItems.source, 'user'),
          eq(gameItems.uploaderId, userId)
        )
      )
      .orderBy(gameItems.createdAt);

    return Response.json(userItems);
  } catch (error) {
    console.error("Failed to fetch user items:", error);
    return Response.json({ error: "Failed to fetch user items" }, { status: 500 });
  }
}

// Create a new user item
export async function POST(request: Request) {
  try {
    const { userId } = getAuth(request as any);
    
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      category, 
      type, 
      power, 
      effect, 
      rarity, 
      description, 
      imageUrl 
    } = body;

    // Validate required fields
    if (!name || !category || !rarity) {
      return Response.json(
        { error: "Name, category, and rarity are required" },
        { status: 400 }
      );
    }

    const [newItem] = await db
      .insert(gameItems)
      .values({
        name,
        category,
        type: type || "Generic",
        power: power || "None",
        effect: effect || "None",
        rarity,
        description: description || "",
        imageUrl: imageUrl || "/api/placeholder/400/300",
        userId: userId, // Keep the original userId field for compatibility
        uploaderId: userId,
        source: 'user',
        isUserCreated: true,
      })
      .returning();

    return Response.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Failed to create item:", error);
    return Response.json({ error: "Failed to create item" }, { status: 500 });
  }
}