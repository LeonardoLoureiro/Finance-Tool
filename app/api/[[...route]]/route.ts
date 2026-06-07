import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const runtmie = 'edge';

const app = new Hono().basePath('/api');

app.get('/hello', (context) => {
  return context.json({ 
    message: 'Hello, World!' 
  });
});

export const GET = handle(app);
export const POST = handle(app);