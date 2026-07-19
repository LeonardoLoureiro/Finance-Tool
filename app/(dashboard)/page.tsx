"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { ExpensesCard } from "@/features/summary/components/expenses-card";
import { IncomeCard } from "@/features/summary/components/income-card";
import { RemainingCard } from "@/features/summary/components/remaining-card";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";

export default function Home() {
  const { user } = useUser();
  const { data, isLoading } = useGetSummary({ type: "all" });

  const current = data?.data.summary.currentPeriod;
  const changes = data?.data.summary.changes;
  const period = data?.data.period;

  const dateRange = period
    ? `${format(new Date(period.from), "MMM d")} - ${format(new Date(period.to), "MMM d, yyyy")}`
    : "";

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.firstName || "there"}! 👋
        </h1>
        <p className="text-muted-foreground">
          This is your financial board
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <RemainingCard
          amount={current?.net || 0}
          dateRange={dateRange}
          change={changes ? { amount: changes.net, percent: changes.netPercent } : undefined}
          isLoading={isLoading}
        />
        <IncomeCard
          amount={current?.income || 0}
          dateRange={dateRange}
          change={changes ? { amount: changes.income, percent: changes.incomePercent } : undefined}
          isLoading={isLoading}
        />
        <ExpensesCard
          amount={current?.expenses || 0}
          dateRange={dateRange}
          change={changes ? { amount: changes.expenses, percent: changes.expensesPercent } : undefined}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}