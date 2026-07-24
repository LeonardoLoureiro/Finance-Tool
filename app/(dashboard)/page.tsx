"use client";

import { CategoryPieChart } from "@/components/charts/pie-charts";
import { TrendChart } from "@/components/charts/trend-charts";
import { DatePicker } from "@/components/date-picker";
import { ExpensesCard } from "@/components/expenses-card";
import { IncomeCard } from "@/components/income-card";
import { RemainingCard } from "@/components/remaining-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { useGetDailyTransactions } from "@/features/transactions/api/use-get-daily-transactions";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export default function Home() {
  // State for filters - store the ID as a string
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Calculate date range
  const fromDate = dateRange.from ? format(startOfDay(dateRange.from), "yyyy-MM-dd") : undefined;
  const toDate = dateRange.to ? format(endOfDay(dateRange.to), "yyyy-MM-dd") : undefined;

  // Fetch accounts for dropdown
  const { data: accountsData, isLoading: isAccountsLoading } = useGetAccounts();

  // Fetch summary with filters
  const { data: summaryData, isLoading: isSummaryLoading } = useGetSummary({
    type: "all",
    from: fromDate,
    to: toDate,
    accountId: selectedAccountId !== "all" ? selectedAccountId : undefined,
  });

  // Fetch daily aggregated data with filters
  const { data: dailyData, isLoading: isDailyLoading } = useGetDailyTransactions({
    from: fromDate,
    to: toDate,
    accountId: selectedAccountId !== "all" ? selectedAccountId : undefined,
  });

  const current = summaryData?.data.summary.currentPeriod;
  const changes = summaryData?.data.summary.changes;
  const period = summaryData?.data.period;
  const categories = summaryData?.data.categories.currentPeriod.categories;

  // Use the pre-aggregated daily data directly
  const trendData = dailyData?.data?.map((item: any) => ({
    date: item.date,
    income: item.income,
    expenses: item.expenses,
    count: item.count,
  })) || [];

  // Category data for pie chart (only expenses)
  const categoryData = categories
    ? categories
        .filter((cat: { total: number }) => cat.total < 0)
        .map((cat: { name: string; total: number }) => ({
          name: cat.name,
          value: Math.abs(cat.total),
        }))
    : [];

  const dateRangeDisplay = dateRange.from && dateRange.to
    ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`
    : "";

  const isLoading = isSummaryLoading || isDailyLoading || isAccountsLoading;

  // Reset filters
  const handleReset = () => {
    setSelectedAccountId("all");
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    });
  };

  // Helper function to get account name from ID
  const getAccountName = (accountId: string) => {
    if (accountId === "all") return "All Accounts";
    const account = accountsData?.find((acc: any) => acc.id === accountId);
    return account?.name || accountId; // Fallback to ID if name not found
  };

  return (
    <div className="flex flex-col items-center px-6 pt-6">
      {/* filters */}
      <div className="flex flex-wrap items-center gap-3 w-full max-w-4xl mb-6">
        {/* account filter */}
        <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Accounts">
              {getAccountName(selectedAccountId)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            {accountsData?.map((account: any) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* date range Picker */}
        <DatePicker
          mode="range"
          value={dateRange}
          onChange={(range) => {
            if (range && typeof range === "object" && "from" in range && "to" in range) {
              setDateRange(range as DateRange);
            }
          }}
          dateFormat="MMM d, yyyy"
          placeholder="Select date range"
          className="w-[280px]"
        />

        {/* reset Button */}
        <Button variant="outline" size="sm" onClick={handleReset} className="h-9">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>

        {/* Date range display */}
        <span className="text-sm text-muted-foreground ml-auto">
          {dateRangeDisplay || "Select a date range"}
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full">
        <RemainingCard
          amount={current?.net || 0}
          dateRange={dateRangeDisplay}
          change={changes ? { amount: changes.net, percent: changes.netPercent } : undefined}
          isLoading={isLoading}
          variant="default"
        />
        <IncomeCard
          amount={current?.income || 0}
          dateRange={dateRangeDisplay}
          change={changes ? { amount: changes.income, percent: changes.incomePercent } : undefined}
          isLoading={isLoading}
          variant="default"
          accentColor="green"
        />
        <ExpensesCard
          amount={current?.expenses || 0}
          dateRange={dateRangeDisplay}
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