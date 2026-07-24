# Finance Tool

Finance Tool is a modern personal finance dashboard built with Next.js, TypeScript, and a PostgreSQL-backed data layer. It helps you track account balances, review spending trends, manage transactions, and organize categories in a polished dashboard experience.

## What this project does

- Provides a secure authentication flow with Clerk
- Displays financial summaries on the dashboard with filters by account and date range
- Tracks transactions, accounts, and categories
- Supports importing transaction data and bulk transaction actions
- Includes user settings and profile management
- Exposes a typed API layer for the frontend using Hono

## Tech stack

| Area | Tooling |
| --- | --- |
| Framework | Next.js 16.2.7 |
| UI | React 19.2.4, Tailwind CSS 4, shadcn/ui-style components |
| Language | TypeScript 5 |
| Data & ORM | Drizzle ORM 0.45.2, PostgreSQL via Neon serverless |
| Auth | Clerk 7.4.3 |
| API layer | Hono 4.12.23 |
| Data fetching | TanStack React Query 5, Zustand |
| Charts | Recharts 3.9.2 |
| Validation | Zod 4.4.3 |

## Project structure

- app/ – route-level pages, auth screens, dashboard views, and API entrypoints
- components/ – shared UI and chart components
- features/ – domain-specific hooks, API wrappers, and feature components
- db/ – database schema and Drizzle connection
- drizzle/ – generated migration files
- scripts/ – database migration helper scripts
- lib/ – shared helpers and client utilities

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 20+ recommended
- npm or another package manager compatible with package-lock.json
- A PostgreSQL-compatible database, such as Neon
- A Clerk account for authentication keys

## Environment setup

Create a .env.local file in the project root with values similar to the following:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

> The app is already wired to read .env.local for local development.

## Installation

Install dependencies:

```bash
npm install
```

## Database setup

Generate and apply the database migrations:

```bash
npm run db:generate
npm run db:migrate
```

You can also launch Drizzle Studio for inspecting the database:

```bash
npm run db:studio
```

## Run locally

Start the development server:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Available scripts

| Script | Purpose |
| --- | --- |
| npm run dev | Start the Next.js development server |
| npm run build | Build the production bundle |
| npm run start | Start the production build |
| npm run lint | Run ESLint |
| npm run db:generate | Generate Drizzle migrations |
| npm run db:migrate | Apply migrations to the configured database |
| npm run db:studio | Open Drizzle Studio |

## Key features

- Dashboard summaries with net income, income, and expenses cards
- Date range and account filtering for financial insights
- Trend and category charts for expense analysis
- Transaction history with table-based management and delete actions
- CSV-style import workflow for bulk transaction creation
- Account and category management screens
- Settings page for profile updates, preferences, and account management

## Notes

- The app uses a Neon/Postgres database and expects the DATABASE_URL environment variable to be available.
- Authentication is protected through Clerk and is enforced on the API routes.
- A production build check currently reports a TypeScript type issue in the dashboard filter select handler, so the development workflow is the most reliable path for local use right now.

## Future ideas

Potential next steps for this project include:

- recurring transaction automation
- budget goals and alerts
- bank sync integrations
- richer reporting and export options
- mobile-friendly refinements
