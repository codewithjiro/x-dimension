// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, unique } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `x-dimension_${name}`);

export const gameItems = createTable("game_items", (d) => ({
  id: d.serial("id").primaryKey(),
  name: d.varchar("name", { length: 100 }).notNull(),
  category: d.varchar("category", { length: 50 }).notNull(),
  type: d.varchar("type", { length: 50 }).notNull(),
  power: d.varchar("power", { length: 100 }),
  effect: d.varchar("effect", { length: 255 }),
  rarity: d.varchar("rarity", { length: 50 }),
  description: d.text("description"),
  imageUrl: d.varchar("image_url", { length: 512 }),
  userId: d.varchar("user_id", { length: 64 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  fileName: d.varchar("file_name", { length: 256 }),
  isUserCreated: d.boolean("is_user_created").default(false),
  uploaderId: d.varchar("uploader_id", { length: 64 }), 
  source: d.varchar("source", { length: 20 }).default("api"), 
}));

export const comments = createTable("comments", (d) => ({
  id: d.serial("id").primaryKey(),
  itemId: d.integer("item_id").notNull(),
  userId: d.varchar("user_id", { length: 64 }).notNull(),
  content: d.text("content").notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));
