import { NextRequest } from "next/server";
import { db } from "~/server/db";
import { comments } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";

// Update a comment
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request as any);
    
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const commentId = parseInt(params.id);
    if (isNaN(commentId)) {
      return Response.json({ error: "Invalid comment ID" }, { status: 400 });
    }

    const { content } = await request.json();

    if (!content || content.trim() === "") {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    // Check if comment exists and belongs to user
    const existingComment = await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.id, commentId),
          eq(comments.userId, userId)
        )
      )
      .then(res => res[0]);

    if (!existingComment) {
      return Response.json({ error: "Comment not found or access denied" }, { status: 404 });
    }

    const [updatedComment] = await db
      .update(comments)
      .set({ 
        content: content.trim(),
        updatedAt: new Date()
      })
      .where(
        and(
          eq(comments.id, commentId),
          eq(comments.userId, userId)
        )
      )
      .returning();

    return Response.json(updatedComment);
  } catch (error) {
    console.error("Failed to update comment:", error);
    return Response.json({ error: "Failed to update comment" }, { status: 500 });
  }
}

// Delete a comment
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request as any);
    
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const commentId = parseInt(params.id);
    if (isNaN(commentId)) {
      return Response.json({ error: "Invalid comment ID" }, { status: 400 });
    }

    // Check if comment exists and belongs to user
    const existingComment = await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.id, commentId),
          eq(comments.userId, userId)
        )
      )
      .then(res => res[0]);

    if (!existingComment) {
      return Response.json({ error: "Comment not found or access denied" }, { status: 404 });
    }

    const [deletedComment] = await db
      .delete(comments)
      .where(
        and(
          eq(comments.id, commentId),
          eq(comments.userId, userId)
        )
      )
      .returning();

    return Response.json({ 
      message: "Comment deleted successfully",
      deletedComment 
    });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return Response.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}