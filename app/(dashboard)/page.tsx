"use client";

import { TrendChart } from "@/components/charts";
import { ExpensesCard } from "@/components/expenses-card";
import { IncomeCard } from "@/components/income-card";
import { CategoryPieChart } from "@/components/pie-charts";
import { RemainingCard } from "@/components/remaining-card";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { format } from "date-fns";

export default function Home() {
  const { data, isLoading } = useGetSummary({ type: "all" });

  const current = data?.data.summary.currentPeriod;
  const changes = data?.data.summary.changes;
  const period = data?.data.period;

  const categories = data?.data.categories.currentPeriod.categories;


  //mockdata for now
  const trendData = [
    { date: "2026-07-13", income: 0, expenses: 45 },
    { date: "2026-07-14", income: 0, expenses: 89 },
    { date: "2026-07-15", income: 2500, expenses: 155 },
    { date: "2026-07-16", income: 0, expenses: 140 },
    { date: "2026-07-17", income: 0, expenses: 195 },
    { date: "2026-07-18", income: 0, expenses: 52 },
    { date: "2026-07-19", income: 0, expenses: 35 },
  ];
  
  const categoryData = categories
    ? categories
        .filter((cat) => cat.total < 0) // Only expenses
        .map((cat) => ({
          name: cat.name,
          value: Math.abs(cat.total),
        }))
    : [];

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

      {/* charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl w-full mt-8">
        <div className="lg:col-span-2">
          <TrendChart data={trendData} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <CategoryPieChart data={categoryData} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}