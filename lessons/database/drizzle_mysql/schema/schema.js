import { relations, sql } from 'drizzle-orm';
import { boolean, int, mysqlEnum, mysqlTable, serial, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users_table', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  age: int().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

// creating schema for authentication lesson
export const usersAuth = mysqlTable('users_auth', {
  id: int().autoincrement().primaryKey(),
  username: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  isEmailValid: boolean("is_email_valid").default(false).notNull(),
  password: varchar({ length: 255 }),
  avatarURL: text("avatar_url"),
});

// creating schema for user data authentication lesson
export const userData = mysqlTable('user_data', {
  id: int().autoincrement().primaryKey(),
  title: varchar({ length: 255 }).notNull().unique(),
  tagline: varchar({ length: 255 }).notNull(),
  userId: int("user_id").notNull().references(() => usersAuth.id),
});

// a user can many data / sessions
export const userRelation = relations(usersAuth, ({many}) => ({
  data: many(userData),
  session: many(sessionsTable)
}));

// a single data belongs to a user
export const dataRelation = relations(userData, ({one}) => ({
  user: one(usersAuth, {
    fields: [userData.userId],
    references: [usersAuth.id]
  })
}));

// session schema
export const sessionsTable = mysqlTable("sessions", {
  id: int().autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => usersAuth.id, { onDelete: "cascade" }),
  valid: boolean().default(true).notNull(),
  userAgent: text("user_agent"),
  ip: varchar({ length: "255" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
})

export const sessionsRelation = relations(sessionsTable, ({one}) => ({
  user: one(usersAuth, {
    fields: [sessionsTable.userId], // foreign key
    references: [usersAuth.id], // reference
  })
}))

// email verification schema
export const verifyEmailTokensTable = mysqlTable("is_email_token", {
  id: int().autoincrement().notNull().primaryKey(),
  userId: int("user_id").notNull().references(() => usersAuth.id, { onDelete: "cascade" }),
  token: varchar({ length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").default(sql`(CURRENT_TIMESTAMP + INTERVAL 1 DAY)`).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// passwordResetTokensTable
export const passwordResetTokensTable = mysqlTable("password_reset_token", {
  id: int("id").autoincrement().primaryKey(),
  userId: 
  int("user_id")
  .notNull()
  .references(() => usersAuth.id, { onDelete: "cascade"})
  .unique(),
  tokenHash: text("token_hash").notNull(),
  expiresAt: 
  timestamp("expires_at")
  .default(sql`(CURRENT_TIMESTAMP + INTERVAL 1 HOUR)`)
  .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
})

// oauthAccountsTable
export const oauthAccountsTable = mysqlTable("oauth_accounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => usersAuth.id, { onDelete: "cascade" }),
  provider: mysqlEnum("provider", ["google", "github"]).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull()
})