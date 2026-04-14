import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const generations = sqliteTable("generations", {
  id: text("id").primaryKey(),
  prompt: text("prompt").notNull(),
  fullPrompt: text("full_prompt").notNull(),
  presetId: text("preset_id").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  model: text("model").notNull(),
  imageKey: text("image_key").notNull(),
  createdAt: text("created_at").notNull(),
  status: text("status").notNull(),
  errorMessage: text("error_message"),
});
