import { db } from "@/db/drizzle";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import { accounts, transactions } from "@/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { calculatePercentChange, convertAmountFromMilliUnits } from "@/lib/utils";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
    })),

    async (context) => {
      const auth = getAuth(context);

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: context.json({ error: "Unauthorised" }, 401),
        });
      }

      // default date range (last 30 days)
      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      // get data, is given, from request
      const { from, to, accountId } = context.req.valid("query");

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to
        ? parse(to, "yyyy-MM-dd", new Date())
        : defaultTo;

      // calculate previous period (same length, before current)
      const periodLength = differenceInDays(endDate, startDate) +1;
      const previousStart = subDays(startDate, periodLength);
      const previousEnd = subDays(endDate, periodLength);

      // fetch all transactions for the date range of this and last period,
      // do this first so not to have to redo it later down the line.
      const transactionsData = await db
        .select({
          amount: transactions.amount,
          date: transactions.date,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, previousStart), // get both periods at once
            lte(transactions.date, endDate),
          )
        );
      
      // iterate over all transaction within a date range and 
      // return income, expenses and net.
      const calculateTotal = (rangeStart: Date, rangeEnd: Date) => {
        const filtered = transactionsData.filter(
          (t) => t.date >= rangeStart && t.date <= rangeEnd
        );

        let income = 0;
        let expenses = 0;

        filtered.forEach((t) => {
          const amount = convertAmountFromMilliUnits(t.amount);

          if (amount >= 0) {
            income += amount;
          } else {
            expenses += Math.abs(amount);
          }

        });

        return {
          income: income,
          expenses: expenses,
          net: income-expenses,
          count: filtered.length,
        }
      };

      const currentPeriod = calculateTotal(startDate, endDate);
      const lastPeriod = calculateTotal(previousStart, previousEnd);

      const changes = {
        income: currentPeriod.income - lastPeriod.income,
        incomePercent: calculatePercentChange(currentPeriod.income, lastPeriod.income),

        expenses: currentPeriod.expenses - lastPeriod.expenses,
        expensesPercent: calculatePercentChange(currentPeriod.expenses, lastPeriod.expenses),

        net: currentPeriod.net - lastPeriod.net,
        netPercent: calculatePercentChange(currentPeriod.net, lastPeriod.net),
      }

      return context.json({
        data: {
          currentPeriod,
          lastPeriod,
          changes,
          period: {
            from: startDate,
            to: endDate,
          },
        },
      });
    }
    
  )

export default app;