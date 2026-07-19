import { Hono } from "hono";
import { handle } from "hono/vercel";
import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";
import { HTTPException } from "hono/http-exception";


export const runtime = "edge";

const app = new Hono().basePath("/api");

app.onError((error, context) => {
  if (error instanceof HTTPException) {
    return error.getResponse();
  }

  // handle any unhandled error that my come up.
  return context.json( {error: "Internal Error."}, 500 );
});

const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions);

// Instead of writing "const..." we simple pass it to handle and Hono handles it seamlessly.
// This is a great way to keep our code clean and concise, especially when we have multiple routes to handle.
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;