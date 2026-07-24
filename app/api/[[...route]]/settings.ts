import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

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

      return (context.json( { "nothing": "Nothing."}, 200 ));
    }
  );

export default app;