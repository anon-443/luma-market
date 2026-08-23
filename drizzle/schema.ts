import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing the Manus OAuth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * Reviews are created only from the visitor review form. No fixtures or sample records
 * are ever inserted by the application.
 */
export const productReviews = mysqlTable(
  "product_reviews",
  {
    id: int("id").autoincrement().primaryKey(),
    productId: int("productId").notNull(),
    authorName: varchar("authorName", { length: 80 }).notNull(),
    rating: int("rating").notNull(),
    comment: text("comment").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("product_reviews_product_created_idx").on(table.productId, table.createdAt)]
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type ProductReview = typeof productReviews.$inferSelect;
