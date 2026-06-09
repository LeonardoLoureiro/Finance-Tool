import { Hono } from "hono";
import { handle } from "hono/vercel";
import accounts from "./accounts";


export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app.
  route("/accounts", accounts);

// Instead of writing "const..." we simple pass it to handle and Hono handles it seamlessly.
// This is a great way to keep our code clean and concise, especially when we have multiple routes to handle.
export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;