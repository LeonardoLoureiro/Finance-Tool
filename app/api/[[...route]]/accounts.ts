import { Hono } from "hono";
import { db } from "@/db/drizzle"
import { accounts } from "@/db/schema";

const app = new Hono()
  .get("/" , async (context) => {
    const data = await db.select({
      id: accounts.id,
      name: accounts.name,
    }).from(accounts);

    return context.json({ accounts: data });
});

export default app;