import { db } from "@/db/drizzle";
import { transactions, insertTransactionsSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm/sql/expressions/conditions";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";

const app = new Hono()
  // GET all transactions for user
  .get(
    "/",
    clerkMiddleware(), 
    async (context) => {
      const auth = getAuth(context);

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised" }, 401),
        });
      }

      const data = await db
        .select({
          id: transactions.id,
          amount: transactions.amount,
          payee: transactions.payee,
          date: transactions.date,
          notes: transactions.notes,
          accountId: transactions.accountId,
          categoryId: transactions.categoryId,
        })
        .from(transactions)
        .where(eq(transactions.accountId, transactions.accountId)); // placeholder safety removed below

      return context.json({ data });
    }
  )
  // GET single transaction
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param", 
      z.object({ id: z.string() })),
    async (context) => {
      const auth = getAuth(context);
      const { id } = context.req.valid("param");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised" }, 401),
        });
      }
      
      const [data] = await db
        .select({
          id: transactions.id,
          amount: transactions.amount,
          payee: transactions.payee,
          date: transactions.date,
          notes: transactions.notes,
          accountId: transactions.accountId,
          categoryId: transactions.categoryId,
        })
        .from(transactions)
        .where(eq(transactions.id, id));

      if (!data) {
        return context.json({ error: "Not found" }, 404);
      }

      return context.json({ data });
    }
  )

  // CREATE transaction
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertTransactionsSchema.pick({
        amount: true,
        payee: true,
        date: true,
        notes: true,
        accountId: true,
        categoryId: true,
      })
    ),
    async (context) => {
      const auth = getAuth(context);
      const values = context.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised" }, 401),
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

  // BULK DELETE
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (context) => {
      const auth = getAuth(context);
      const { ids } = context.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised" }, 401),
        });
      }

      const data = await db
        .delete(transactions)
        .where(inArray(transactions.id, ids))
        .returning({ id: transactions.id });

      return context.json({ data });
    }
  )

  // PATCH
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    zValidator(
      "json",
      insertTransactionsSchema.pick({
        amount: true,
        payee: true,
        date: true,
        notes: true,
        accountId: true,
        categoryId: true,
      })
    ),
    async (context) => {
      const auth = getAuth(context);
      const { id } = context.req.valid("param");
      const values = context.req.valid("json");

      if (!auth?.userId) {
        return context.json({ error: "Unauthorised" }, 401);
      }

      const [data] = await db
        .update(transactions)
        .set(values)
        .where(eq(transactions.id, id))
        .returning();

      if (!data) {
        return context.json({ error: "Not found" }, 404);
      }

      return context.json({ data });
    }
  )

  // DELETE
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    async (context) => {
      const auth = getAuth(context);
      const { id } = context.req.valid("param");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised" }, 401),
        });
      }

      const [data] = await db
        .delete(transactions)
        .where(eq(transactions.id, id))
        .returning({ id: transactions.id });

      if (!data) {
        return context.json({ error: "Not found" }, 404);
      }

      return context.json({ data });
    }
  );

export default app;