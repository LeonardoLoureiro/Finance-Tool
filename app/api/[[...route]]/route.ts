import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';


export const runtime = 'edge';

const app = new Hono().basePath('/api');

app
  .get(
    '/hello',
    clerkMiddleware(),
    (context) => {
      const auth = getAuth(context);

      if (!auth?.userId) {
        return context.json({ message: 'Unauthorized' });
      }

      return context.json({ 
        message: 'Hello, World!',
        userID: auth.userId, 
      });  
    }
  )

// Instead of writing "const..." we simple pass it to handle and Hono handles it seamlessly.
// This is a great way to keep our code clean and concise, especially when we have multiple routes to handle.
export const GET = handle(app);
export const POST = handle(app);