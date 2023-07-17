import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  displayName: text("display_name").notNull(),
});

export const idAssociation = sqliteTable(
  "id_association",
  {
    provider: text("provider").notNull(),
    providerId: text("provider_id").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    pk: primaryKey(table.provider, table.providerId),
  }),
);

export const posts = sqliteTable(
  "posts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    title: text("title").notNull(),
    body: text("body").notNull(),
  },
  (table) => ({
    indexByUser: index("user_id_idx").on(table.userId),
  }),
);
