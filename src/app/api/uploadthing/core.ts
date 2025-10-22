import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import z from "zod";
import { db } from "~/server/db";
import { gameItems } from "~/server/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        name: z.string().min(2),
        category: z.string().min(2),
        type: z.string().optional(),
        power: z.string().optional(),
        effect: z.string().optional(),
        rarity: z.string().optional(),
        description: z.string().optional(),
        isUserCreated: z.boolean().optional(),
        source: z.string().optional(),
      }),
    )

    // Forward input + userId to metadata
    .middleware(async ({ input }) => {
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");

      return { userId, ...input };
    })

    .onUploadComplete(async ({ metadata, file }) => {
      // Return the image URL without inserting into the database
      return {
        uploadedBy: metadata.userId,
        imageUrl: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
