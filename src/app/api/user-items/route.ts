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
    if (!name || !name.trim()) {
      return Response.json(
        { error: "Item name is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return Response.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!rarity) {
      return Response.json(
        { error: "Rarity is required" },
        { status: 400 }
      );
    }

    const [newItem] = await db
      .insert(gameItems)
      .values({
        name: name.trim(),
        category,
        type: type || "Generic",
        power: power || "None",
        effect: effect || "None",
        rarity,
        description: description?.trim() || "",
        imageUrl: imageUrl?.trim() || "/api/placeholder/400/300",
        userId: userId, // Keep for compatibility
        uploaderId: userId,
        source: 'user',
        isUserCreated: true,
      })
      .returning();

    return Response.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create item:", error);
    
    // Handle database constraints
    if (error.code === '23505') { // Unique constraint violation
      return Response.json(
        { error: "An item with this name already exists" },
        { status: 400 }
      );
    }
    
    return Response.json({ error: "Failed to create item" }, { status: 500 });
  }
}