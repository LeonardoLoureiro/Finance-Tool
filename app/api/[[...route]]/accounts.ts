import { Hono } from "hono";
import { db } from "@/db/drizzle"
import { accounts } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

const app = new Hono()
  .get("/" ,
    clerkMiddleware(), 
    async (context) => {
      const auth = getAuth(context);

      if (!auth?.userId) {
        return context.json({ "error": "Unauthorised." }, 401);
      }

      const data = await db.select({
        id: accounts.id,
        name: accounts.name,
      }).from(accounts);

    return context.json({ data });
});

export default app;