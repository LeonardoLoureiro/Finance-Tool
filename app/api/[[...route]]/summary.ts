// features/transactions/api/summary.ts

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

      // get data, if given, from request
      const { from, to, accountId, type } = context.req.valid("query");

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to
        ? parse(to, "yyyy-MM-dd", new Date())
        : defaultTo;

      // calculate previous period (same length, before current)
      const periodLength = differenceInDays(endDate, startDate) + 1;
      const previousStart = subDays(startDate, periodLength);
      const previousEnd = subDays(endDate, periodLength);

      // fetch all transactions for BOTH periods in ONE query
      const transactionsData = await db
        .select({
          amount: transactions.amount,
          date: transactions.date,
          categoryName: categories.name,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, previousStart), // get both periods at once
            lte(transactions.date, endDate),
          )
        );

      // ============ HELPER FUNCTIONS ============

      // helper to get amount based on type filter
      // e.g., if transaction of +5 but scanning for expenses
      // then just ignore it
      const getAmount = (amount: number): number | null => {
        const value = convertAmountFromMilliUnits(amount);

        if (type === "income" && value < 0) return null;
        if (type === "expense" && value > 0) return null;

        return value;
      };

      // helper: Calculate summary totals for a date range
      const calculateTotals = (rangeStart: Date, rangeEnd: Date) => {
        const filtered = transactionsData.filter(
          (t) => t.date >= rangeStart && t.date <= rangeEnd
        );

        let income = 0;
        let expenses = 0;

        filtered.forEach((t) => {
          const amount = getAmount(t.amount);
          if (amount === null) return;

          if (amount >= 0) {
            income += amount;
          } else {
            expenses += Math.abs(amount);
          }
        });

        return {
          income: income,
          expenses: expenses,
          net: income - expenses,
          count: filtered.length,
        };
      };

      // helper: Group categories for a date range
      const getCategoriesForPeriod = (rangeStart: Date, rangeEnd: Date) => {
        const filtered = transactionsData.filter(
          (t) => t.date >= rangeStart && t.date <= rangeEnd
        );

        const grouped: Record<string, { count: number; total: number }> = {};

        filtered.forEach((t) => {
          const amount = getAmount(t.amount);
          if (amount === null) return;

          const categoryName = t.categoryName || "Uncategorised";

          if (!grouped[categoryName]) {
            grouped[categoryName] = { count: 0, total: 0 };
          }
          grouped[categoryName].count++;
          grouped[categoryName].total += amount;
        });

        // convert to array with average
        return Object.entries(grouped).map(([name, data]) => ({
          name,
          count: data.count,
          total: data.total,
          average: data.total / data.count,
        }));
      };

      // helper: Calculate category totals
      const calculateCategoryTotals = (categories: any[]) => {
        let income = 0;
        let expenses = 0;
        let count = 0;

        categories.forEach((cat) => {
          if (cat.total > 0) {
            income += cat.total;
          } else {
            expenses += Math.abs(cat.total);
          }
          count += cat.count;
        });

        return { income, expenses, net: income - expenses, count };
      };

      // ============ CALCULATE CURRENT PERIOD ============

      // summary totals for current period
      const currentTotals = calculateTotals(startDate, endDate);

      // categories for current period
      const currentCategories = getCategoriesForPeriod(startDate, endDate);
      const currentCategoryTotals = calculateCategoryTotals(currentCategories);

      // ============ CALCULATE LAST PERIOD ============

      // summary totals for last period
      const lastTotals = calculateTotals(previousStart, previousEnd);

      // categories for last period
      const lastCategories = getCategoriesForPeriod(previousStart, previousEnd);
      const lastCategoryTotals = calculateCategoryTotals(lastCategories);

      // ============ CALCULATE CHANGES ============

      // summary changes
      const summaryChanges = {
        income: currentTotals.income - lastTotals.income,
        incomePercent: calculatePercentChange(currentTotals.income, lastTotals.income),
        expenses: currentTotals.expenses - lastTotals.expenses,
        expensesPercent: calculatePercentChange(currentTotals.expenses, lastTotals.expenses),
        net: currentTotals.net - lastTotals.net,
        netPercent: calculatePercentChange(currentTotals.net, lastTotals.net),
      };

      // category changes
      const categoryChanges = {
        income: currentCategoryTotals.income - lastCategoryTotals.income,
        incomePercent: calculatePercentChange(currentCategoryTotals.income, lastCategoryTotals.income),
        expenses: currentCategoryTotals.expenses - lastCategoryTotals.expenses,
        expensesPercent: calculatePercentChange(currentCategoryTotals.expenses, lastCategoryTotals.expenses),
        net: currentCategoryTotals.net - lastCategoryTotals.net,
        netPercent: calculatePercentChange(currentCategoryTotals.net, lastCategoryTotals.net),
      };

      return context.json({
        data: {
          // summary section (income, expenses, net, count)
          summary: {
            currentPeriod: currentTotals,
            lastPeriod: lastTotals,
            changes: summaryChanges,
          },
          // categories section
          categories: {
            currentPeriod: {
              categories: currentCategories,
              totals: currentCategoryTotals,
            },
            lastPeriod: {
              categories: lastCategories,
              totals: lastCategoryTotals,
            },
            changes: categoryChanges,
          },
          // period info
          period: {
            from: startDate,
            to: endDate,
          },
        },
      });
    }
  );

export default app;