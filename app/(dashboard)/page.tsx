"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { ExpensesCard } from "@/features/summary/components/expenses-card";
import { IncomeCard } from "@/features/summary/components/income-card";
import { RemainingCard } from "@/features/summary/components/remaining-card";
import { format } from "date-fns";

export default function Home() {
  const { data, isLoading } = useGetSummary({ type: "all" });

  const current = data?.data.summary.currentPeriod;
  const changes = data?.data.summary.changes;
  const period = data?.data.period;

  const dateRange = period
    ? `${format(new Date(period.from), "MMM d")} - ${format(new Date(period.to), "MMM d, yyyy")}`
    : "";

  return (
    <div className="flex flex-col items-center px-6 pt-6">
      {/* cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full">
        <RemainingCard
          amount={current?.net || 0}
          dateRange={dateRange}
          change={changes ? { amount: changes.net, percent: changes.netPercent } : undefined}
          isLoading={isLoading}
          variant="default"
        />
        
        <IncomeCard
          amount={current?.income || 0}
          dateRange={dateRange}
          change={changes ? { amount: changes.income, percent: changes.incomePercent } : undefined}
          isLoading={isLoading}
          variant="default"
          accentColor="green"
        />
        
        <ExpensesCard
          amount={current?.expenses || 0}
          dateRange={dateRange}
          change={changes ? { amount: changes.expenses, percent: changes.expensesPercent } : undefined}
          isLoading={isLoading}
          variant="default"
          accentColor="red"
        />
      </div>
    </div>
  );
}