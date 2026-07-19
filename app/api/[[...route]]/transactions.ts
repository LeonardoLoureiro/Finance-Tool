import { db } from "@/db/drizzle";
import {
  accounts,
  categories,
  insertTransactionsSchema,
  transactions
} from "@/db/schema";
import { convertAmountToMilliUnits } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { parse, subDays } from "date-fns";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";


// when importing data from csv files, this schema
// MUST be followed so bare minimum of data
// can be aligned with existing db schema.
// In this case, we only really need the amount,
// payee and date of a transactions, everything else
// is optional.
const importTransactionSchema = z.object({
  amount: z.string(),
  payee: z.string().min(1),
  date: z.coerce.date(),

  account: z.string().min(1),

  category: z.string().optional(),

  notes: z.string().optional(),
});

const app = new Hono()
  // GET transaction within range
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    async (context) => {
      const auth = getAuth(context);

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised" }, 401),
        });
      }

      // default values if nothing given.
      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      // get param passed
      const { from, to, accountId } = context.req.valid("query");
      
      // if no from passed, then only last 30 days
      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;

      // no given end date? Assume up until current day
      const endDate = to 
        ? parse(to, "yyyy-MM-dd", new Date())
        : defaultTo;
      

      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        // fetch all transactions which belong to user ONLY
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        // left join because category is optional (transaction may not have one)
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            // if accountId given then get transactions for that account
            accountId ? eq(transactions.accountId, accountId) : undefined,
            // of course only fetch transactions belonging to user.
            eq(accounts.userId, auth.userId),
            // filter by date range as getting all may be too much data to sort out, unneeded overhead.
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          )
        )
        .orderBy(desc(transactions.date));

      return context.json({ data });  
    }

  )

  // get specific transaction
  .get(
    "/:id",
    clerkMiddleware(),
    async (context) => {
      const auth = getAuth(context);

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised" }, 401),
        });
      }

      const id = context.req.param("id");

      const [transaction] = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          accountId: transactions.accountId,
        })
        .from(transactions)

        // same joins as list route
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            eq(transactions.id, id),
            eq(accounts.userId, auth.userId) // security: ensure ownership
          )
        )
        .limit(1);

      if (!transaction) {
        throw new HTTPException(404, {
          res: context.json({ error: "Transaction not found" }, 404),
        });
      }

      return context.json({ data: transaction });
    }
  )

  // insert a new transaction
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertTransactionsSchema.omit({
        id: true, // no need for user to 'know'
      })
    ),
    async (context) => {
      const auth = getAuth(context);
      const values = context.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised." }, 401),
        });
      }

      const [data] = await db
        .insert(transactions)
        .values({
          id: createId(),
          ...values,
        })
        .returning();

      return context.json({ data });
    }
  )

  // create multiple transactions at once
  // create multiple transactions at once
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(importTransactionSchema)
    ),
    async (context) => {
      try {
        const auth = getAuth(context);
        const values = context.req.valid("json");

        if (!auth?.userId) {
          throw new HTTPException(401, {
            res: context.json({ error: "Unauthorised." }, 401),
          });
        }

        // Step 1: Get unique account names
        const accountNames = [
          ...new Set(
            values.map(
              (transaction) => transaction.account
            )
          ),
        ];
    
        // Step 2: Get unique category names
        const categoryNames = [
          ...new Set(
            values
              .map(
                (transaction) => transaction.category
              )
              .filter(Boolean)
          ),
        ] as string[];
    
        // Step 3: Find existing accounts
        const existingAccounts =
          accountNames.length > 0
            ? await db
                .select()
                .from(accounts)
                .where(
                  and(
                    eq(accounts.userId, auth.userId),
                    inArray(accounts.name, accountNames)
                  )
                )
            : [];
    
        // Step 4: Find existing categories
        const existingCategories =
          categoryNames.length > 0
            ? await db
                .select()
                .from(categories)
                .where(
                  and(
                    eq(categories.userId, auth.userId),
                    inArray(categories.name, categoryNames)
                  )
                )
            : [];
    
        // Step 5: Create account map
        const accountMap = new Map(
          existingAccounts.map(
            (account) => [
              account.name,
              account.id,
            ]
          )
        );
    
        // Step 6: Create category map
        const categoryMap = new Map(
          existingCategories.map(
            (category) => [
              category.name,
              category.id,
            ]
          )
        );
    
        // Step 7: Create missing accounts
        const missingAccounts =
          accountNames.filter(
            (name) =>
              !accountMap.has(name)
          );
    
        if (missingAccounts.length > 0) {
          const newAccounts =
            await db
              .insert(accounts)
              .values(
                missingAccounts.map(
                  (name) => ({
                    id: createId(),
                    name,
                    userId: auth.userId,
                  })
                )
              )
              .returning();
    
          newAccounts.forEach(
            (account) => {
              accountMap.set(
                account.name,
                account.id
              );
            }
          );
        }
        
        // Step 8: Create missing categories
        const missingCategories =
          categoryNames.filter(
            (name) =>
              !categoryMap.has(name)
          );
    
        if (missingCategories.length > 0) {
          const newCategories =
            await db
              .insert(categories)
              .values(
                missingCategories.map(
                  (name) => ({
                    id: createId(),
                    name,
                    userId: auth.userId,
                  })
                )
              )
              .returning();
    
          newCategories.forEach(
            (category) => {
              categoryMap.set(
                category.name,
                category.id
              );
            }
          );
        }

        // Step 9: Assemble transaction rows
        const rows = values.map((transaction, index) => {
          const accountId = accountMap.get(transaction.account);
          if (!accountId) {
            throw new Error(`Account not found for transaction ${index}: ${transaction.account}`);
          }

          const categoryId = transaction.category 
            ? categoryMap.get(transaction.category) 
            : null;
          
          if (transaction.category && !categoryId) {
            throw new Error(`Category not found for transaction ${index}: ${transaction.category}`);
          }

          const amountInMilliunits = convertAmountToMilliUnits(Number(transaction.amount));
    
          return {
            id: createId(),
            amount: amountInMilliunits,
            payee: transaction.payee,
            date: transaction.date,
            notes: transaction.notes,
            accountId: accountId,
            categoryId: categoryId,
          };
        });
    
        // Step 10: Insert transactions
        const insertedTransactions =
          await db
            .insert(transactions)
            .values(rows)
            .returning();
        return context.json({ data: insertedTransactions });
        
      } catch (error) {
        return context.json({ 
          error: "Internal server error",
          details: error instanceof Error ? error.message : String(error)
        }, 500);
      }
    }
  )

  // delete multiple transactions at once
  .post(
    "/bulk-delete",
    clerkMiddleware(),

    // expect an array of transaction ids to delete
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),

    async (context) => {
      const auth = getAuth(context);
      const values = context.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised." }, 401),
        });
      }

      // only transaction belonging to THIS user and match THESE IDs.
      const transactionsToDelete = db.$with("trans_to_delete").as(
        db.select({ id: transactions.id }).from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(
            inArray(transactions.id, values.ids),
            eq(accounts.userId, auth.userId),
          ))
      )

      // finally delete transactions, but ONLY if they are already in the 
      // pre-approved list.
      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
        )
        .returning({
          id: transactions.id,
        });

        // essentially: filter first, then delete.

      return context.json({ data });
    }
  )

  // update a single transaction
  .patch(
    "/:id",
    clerkMiddleware(),

    // validate transaction id from URL
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),

    // validate fields allowed to update
    zValidator(
      "json",
      insertTransactionsSchema.omit({
        id: true,  
      })
    ),

    async (context) => {
      const auth = getAuth(context);
      const { id } = context.req.valid("param");
      const values = context.req.valid("json");

      if (!auth?.userId) {
        return context.json({ error: "Unauthorised" }, 401);
      }

      // ensure this transaction belongs to the user
      const transactionToUpdate = db.$with("transaction_to_update").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              eq(transactions.id, id),
              eq(accounts.userId, auth.userId)
            )
          )
      );

      // update only if it exists in pre-approved list
      const [data] = await db
        .with(transactionToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionToUpdate})`
          )
        )
        .returning();

      if (!data) {
        return context.json({ error: "Not found" }, 404);
      }

      return context.json({ data });
    }
  )

  // delete a single transactions:
  .delete(
    "/:id",
    clerkMiddleware(),

    // validate transaction id from URL
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),

    async (context) => {
      const auth = getAuth(context);
      const { id } = context.req.valid("param");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised." }, 401),
        });
      }

      // only allow deleting transaction if it belongs
      // to this user (via account ownership)
      const transactionToDelete = db.$with("transaction_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              eq(transactions.id, id),
              eq(accounts.userId, auth.userId)
            )
          )
      );

      // delete only if transaction exists in pre-approved list.
      const [data] = await db
        .with(transactionToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionToDelete})`
          )
        )
        .returning({
          id: transactions.id,
        });

      if (!data) {
        return context.json({ error: "Not found" }, 404);
      }

      return context.json({ data });
    }
  );

export default app;
