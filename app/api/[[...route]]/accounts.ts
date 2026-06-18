import { db } from "@/db/drizzle";
import { accounts, insertAccountsSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { createId } from "@paralleldrive/cuid2";
import { convertSegmentPathToStaticExportFilename } from "next/dist/shared/lib/segment-cache/segment-value-encoding";

const app = new Hono()
  .get("/" ,
    clerkMiddleware(), 
    async (context) => {
      const auth = getAuth(context);

      // if user is not logged in, deny acccess.
      if (!auth?.userId) {
        // using HTTPException to throw an error with status code and message.
        // Instead of using just json saying unauthorised, this would actually run into
        // problems later since, for example, user-get-accounts is expecting output data to be 
        // "id: string, name: string". But with unauthorised, it would not fit this structure.
        throw new HTTPException(401, { 
          res: context.json( { error: "Unauthorised."}, 401 )
        });
      }

      const data = await db.select({
        id: accounts.id,
        name: accounts.name,
      }).from(accounts);

    return context.json({ data });
  })
  .post(
    "/",
    clerkMiddleware(),
    // just want to validate the name, since userId is set to notNull,
    // but will use the userId to be the one from getAuth instead.
    zValidator("json", insertAccountsSchema.pick({
      name: true,
    })),
    async (context) => {
      const auth = getAuth(context);
      const values = context.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, { 
          res: context.json( { error: "Unauthorised."}, 401 )
        });
      }

      // must chain 'returning' otherwise nothing will return 
      // to object, which then can be used to return data below this.
      const [data] = await db
        .insert(accounts)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
      }).returning();

      return context.json({ data });
    }
  );

export default app;