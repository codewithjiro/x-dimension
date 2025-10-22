import { NextRequest } from "next/server";
import { db } from "~/server/db";
import { comments } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";

// Get comments for an item
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");

  if (!itemId) {
    return Response.json({ error: "itemId is required" }, { status: 400 });
  }

  try {
    const commentsList = await db
      .select()
      .from(comments)
      .where(eq(comments.itemId, parseInt(itemId)))
      .orderBy(desc(comments.createdAt));

    return Response.json(commentsList);
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return Response.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// Create a new comment
export async function POST(request: Request) {
  try {
    const { userId } = getAuth(request as any);
    
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId, content } = await request.json();

    if (!itemId || !content) {
      return Response.json(
        { error: "itemId and content are required" },
        { status: 400 }
      );
    }

    const [newComment] = await db
      .insert(comments)
      .values({
        itemId: parseInt(itemId),
        userId,
        content: content.trim(),
      })
      .returning();

    return Response.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Failed to create comment:", error);
    return Response.json({ error: "Failed to create comment" }, { status: 500 });
  }
}