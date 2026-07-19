import { db } from "@/db/drizzle";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import { accounts, transactions, categories } from "@/db/schema";
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

  .get(
    "/categories",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
        type: z.enum(["income", "expense", "all"]).optional().default("all"),
      })
    ),

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
      const { from, to, accountId, type } = context.req.valid("query");

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
          categoryName: categories.name,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          )
        );
      
      // helper to get amount based on type filter
      // e.g., if transaction of +5 but scanning for expenses
      // then just ignore it
      const getAmount = (amount: number): number | null => {
        const value = convertAmountFromMilliUnits(amount);

        if (type === "income" && value < 0) return null;
        if (type === "expense" && value > 0) return null;
        
        return value;
      };

      // group by their respective categories
      const groupedCategories: Record<string, { count: number; total: number; transactions: any[] }> = {};

      // iterate through transactions and calculate data
      // of each category amount total and how many
      transactionsData.forEach((t) => {
        const amount = getAmount(t.amount);

        if (amount === null) return;

        const categoryName = t.categoryName || "Uncategorised";

        if (!groupedCategories[categoryName]) {
          // if none exist under this category, create empty object
          groupedCategories[categoryName] = { 
            count: 0,
            total: 0,
            transactions: [],
          }          
        }

        groupedCategories[categoryName].count++;
        groupedCategories[categoryName].total += amount;
      });

      // calculate totals
      let totalIncome = 0;
      let totalExpenses = 0;
      let totalCount = 0;

      // calculate data now so it can be used in frontend.
      const categoriesData = Object.entries(groupedCategories).map(([name, data]) => {
        if (data.total > 0) {
          totalIncome += data.total;
        } else {
          totalExpenses += Math.abs(data.total);
        }
        totalCount += data.count;

        return {
          name,
          count: data.count,
          total: data.total,
          average: data.total / data.count,
        };
      });

      return context.json({
        data: {
          categoriesData, //unsorted
          totals: {
            income: totalIncome,
            expenses: totalExpenses,
            net: totalIncome - totalExpenses,
            count: totalCount,
          },
          period: {
            from: startDate,
            to: endDate,
          },
        },
      });

    }
  )

export default app;