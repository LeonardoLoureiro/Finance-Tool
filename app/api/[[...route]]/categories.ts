import { db } from "@/db/drizzle";
import { categories, insertCategoriesSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm/sql/expressions/conditions";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";

const app = new Hono()
  .get("/",
    clerkMiddleware(),
    async (context) => {
      const auth = getAuth(context);

      // if user is not logged in, deny acccess.
      if (!auth?.userId) {
        // using HTTPException to throw an error with status code and message.
        // Instead of using just json saying unauthorised, this would actually run into
        // problems later since, for example, user-get-categories is expecting output data to be
        // "id: string, name: string". But with unauthorised, it would not fit this structure.
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised." }, 401)
        });
      }

      const data = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        // only return categories belonging to that user, 
        // otherwise EVERY category ever made by all users is returned.
        .where(eq(categories.userId, auth.userId));

      return context.json({ data });
    })

  .get(
    "/:id",
    zValidator("param", z.object({
      id: z.string().optional(),
    })),
    clerkMiddleware(),
    async (context) => {
      const auth = getAuth(context);
      const { id } = context.req.valid("param");

      // if no id, then cannot fetch anything
      if (!id) {
        return context.json({ error: "Missing id" }, 400);
      }

      // not logged in? DENIED
      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised." }, 401)
        });
      }

      const [data] = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id)
          ),
        );

      // if no id found in db, then return error
      if (!data) {
        return context.json({ error: "Not found" }, 404);
      }

      return context.json({ data });
    }
  )

  .post(
    "/",
    clerkMiddleware(),
    // just want to validate the name, since userId is set to notNull,
    // but will use the userId to be the one from getAuth instead.
    zValidator("json", insertCategoriesSchema.pick({
      name: true,
    })),
    async (context) => {
      const auth = getAuth(context);
      const values = context.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised." }, 401)
        });
      }

      // must chain 'returning' otherwise nothing will return
      // to object, which then can be used to return data below this.
      const [data] = await db
        .insert(categories)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return context.json({ data });
    }
  )

  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      // defining our own,
      // so this api will be expecting a json of IDs of category to delete in db.
      z.object({
        ids: z.array(z.string()),
      }),
    ),
    async (context) => {
      const auth = getAuth(context);
      const values = context.req.valid("json");

      // not logged in? DENIED
      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised." }, 401)
        });
      }

      const data = await db
        .delete(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            inArray(categories.id, values.ids)
          )
        )
        .returning({
          id: categories.id,
        });

      return context.json({ data });
    }
  )

  .patch(
    "/:id",
    clerkMiddleware(),
    // first validate the id we are ptaching
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    // next validate the name we want to update when
    // user is editing category name/etc.
    zValidator(
      "json",
      insertCategoriesSchema.pick({
        name: true,
      })
    ),
    async (context) => {
      const auth = getAuth(context);
      const { id } = context.req.valid("param");
      const values = context.req.valid("json");

      // no id? cannot edit anything.
      if (!id) {
        return context.json({ error: "Missing id" }, 400);
      }

      // not signed in? DENIED
      if (!auth?.userId) {
        return context.json({ error: "Unauthorised" }, 401);
      }

      const [data] = await db
        .update(categories)
        .set(values)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id)
          ),
        )
        .returning();

      if (!data) {
        return context.json({ error: "Not found" }, 404);
      }

      return context.json({ data });
    }
  )

  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    async (context) => {
      const auth = getAuth(context);
      const { id } = context.req.valid("param");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised." }, 401),
        });
      }

      const [data] = await db
        .delete(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id)
          )
        )
        .returning({
          id: categories.id,
        });

      if (!data) {
        return context.json({ error: "Not found" }, 404);
      }

      return context.json({ data });
    }
  );

export default app;