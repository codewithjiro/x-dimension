import { NextRequest } from "next/server";
import { db } from "~/server/db";
import { comments, gameItems } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";

// Update a user item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request as any);
    
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itemId = parseInt(params.id);
    if (isNaN(itemId)) {
      return Response.json({ error: "Invalid item ID" }, { status: 400 });
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

    // Check if item exists and belongs to user
    const existingItem = await db
      .select()
      .from(gameItems)
      .where(
        and(
          eq(gameItems.id, itemId),
          eq(gameItems.uploaderId, userId),
          eq(gameItems.source, 'user')
        )
      )
      .then(res => res[0]);

    if (!existingItem) {
      return Response.json({ error: "Item not found or access denied" }, { status: 404 });
    }

    const [updatedItem] = await db
      .update(gameItems)
      .set({
        name: name.trim(),
        category,
        type: type || "Generic",
        power: power || "None",
        effect: effect || "None",
        rarity,
        description: description?.trim() || "",
        imageUrl: imageUrl?.trim() || "/api/placeholder/400/300",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(gameItems.id, itemId),
          eq(gameItems.uploaderId, userId)
        )
      )
      .returning();

    return Response.json(updatedItem);
  } catch (error: any) {
    console.error("Failed to update item:", error);
    
    // Handle database constraints
    if (error.code === '23505') { // Unique constraint violation
      return Response.json(
        { error: "An item with this name already exists" },
        { status: 400 }
      );
    }
    
    return Response.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// Delete a user item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request as any);
    
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itemId = parseInt(params.id);
    if (isNaN(itemId)) {
      return Response.json({ error: "Invalid item ID" }, { status: 400 });
    }

    // Check if item exists and belongs to user
    const existingItem = await db
      .select()
      .from(gameItems)
      .where(
        and(
          eq(gameItems.id, itemId),
          eq(gameItems.uploaderId, userId),
          eq(gameItems.source, 'user')
        )
      )
      .then(res => res[0]);

    if (!existingItem) {
      return Response.json({ error: "Item not found or access denied" }, { status: 404 });
    }

    // First, delete associated comments
    await db.delete(comments).where(eq(comments.itemId, itemId));

    // Then delete the item
    const [deletedItem] = await db
      .delete(gameItems)
      .where(
        and(
          eq(gameItems.id, itemId),
          eq(gameItems.uploaderId, userId)
        )
      )
      .returning();

    return Response.json({ 
      message: "Item deleted successfully",
      deletedItem 
    });
  } catch (error) {
    console.error("Failed to delete item:", error);
    return Response.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

// Get a specific user item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request as any);
    
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itemId = parseInt(params.id);
    if (isNaN(itemId)) {
      return Response.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const item = await db
      .select()
      .from(gameItems)
      .where(
        and(
          eq(gameItems.id, itemId),
          eq(gameItems.uploaderId, userId),
          eq(gameItems.source, 'user')
        )
      )
      .then(res => res[0]);

    if (!item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    return Response.json(item);
  } catch (error) {
    console.error("Failed to fetch item:", error);
    return Response.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}