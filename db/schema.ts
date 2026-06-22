import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(), 
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
})
export const insertAccountsSchema = createInsertSchema(accounts);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
})
export const insertCategoriesSchema = createInsertSchema(categories);

// the amount will nto be stored as float dues to precision
// and not as numeric due to cross-language incompatibility.
// Instead storing it as the smallest unit of monies which is 1 pence.
// Furthermore, milliunit will be used such that £10.50 => 10500. 
// This helps since in the real world taxes and percentages are used and this helps
// transactions be more accurate for example 1% fee of £1.00 is £0.015,
// if only using 2 digits then this calculation would not be possible and snowball from there.
export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  notes: text("notes"),

  accountId: text("account_id").references(() => accounts.id, {
    onDelete: "cascade",
  }).notNull(),

  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }).notNull(),
})

/// RELATIONS
// set one account to many transactions relation
export const accountRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}))

// set one category to many transactions relation
export const categoryRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}))

// set one transaction to ONE account and ONE category relation
export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id]
  }),

  categories: one(categories, {
    fields: [transactions.accountId],
    references: [categories.id]
  })
}))

export const insertTransactionsSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});
