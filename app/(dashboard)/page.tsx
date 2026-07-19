"use client";

import { CategoryPieChart } from "@/components/charts/pie-charts";
import { TrendChart } from "@/components/charts/trend-charts";
import { ExpensesCard } from "@/components/expenses-card";
import { IncomeCard } from "@/components/income-card";
import { RemainingCard } from "@/components/remaining-card";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { convertAmountFromMilliUnits } from "@/lib/utils";
import { format } from "date-fns";

export default function Home() {
  const { data: summaryData, isLoading: isSummaryLoading } = useGetSummary({ type: "all" });

  const current = summaryData?.data.summary.currentPeriod;
  const changes = summaryData?.data.summary.changes;
  const period = summaryData?.data.period;
  const categories = summaryData?.data.categories.currentPeriod.categories;

  const fromDate = period?.from ? format(new Date(period.from), "yyyy-MM-dd") : undefined;
  const toDate = period?.to ? format(new Date(period.to), "yyyy-MM-dd") : undefined;

  const { data: transactions, isLoading: isTransactionsLoading } = useGetTransactions({
    from: fromDate,
    to: toDate,
  });

  // organise data for chart now
  const trendData = (transactions || []).reduce((acc: any[], transaction: any) => {
    const date = format(new Date(transaction.date), "yyyy-MM-dd");
    const existing = acc.find((item) => item.date === date);
    const amount = convertAmountFromMilliUnits(transaction.amount);

    if (existing) {
      if (amount > 0) {
        existing.income += amount;
      } else {
        existing.expenses += Math.abs(amount);
      }
    } else {
      acc.push({
        date,
        income: amount > 0 ? amount : 0,
        expenses: amount < 0 ? Math.abs(amount) : 0,
      });
    }
    return acc;
  }, []);

  const categoryData = categories
    ? categories
        .filter((cat: { total: number }) => cat.total < 0)
        .map((cat: { name: string; total: number }) => ({
          name: cat.name,
          value: Math.abs(cat.total),
        }))
    : [];

  const dateRange = period
    ? `${format(new Date(period.from), "MMM d")} - ${format(new Date(period.to), "MMM d, yyyy")}`
    : "";

  const isLoading = isSummaryLoading || isTransactionsLoading;

  return (
    <div className="flex flex-col items-center px-6 pt-6">
      {/* Cards Grid */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl w-full mt-8">
        <div className="lg:col-span-2">
          <TrendChart data={trendData} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <CategoryPieChart 
            data={categoryData} 
            isLoading={isLoading}
            defaultChartType="pie"
          />
        </div>
      </div>
    </div>
  );
}