import { getTransactionChart } from "@/actions/transactions/charts.action";
import BarChart, { BarChartThisMonth } from "@/components/ChartPage/BarChart";
import LineChart from "@/components/ChartPage/LineChart";
import PieChart from "@/components/ChartPage/PieChart";
import React from "react";

export default async function ChartsPage() {
  const results = await getTransactionChart();

  const currentMonth = new Date().toLocaleString("default", { month: "short" });
  const thisMonthData = (results?.results ?? []).find(
    (item) => item.label === currentMonth
  );

  return (
    <div className="p-3 flex flex-col gap-2">
      <div className="flex-1 shadow-sm border p-3 rounded-md bg-white">
        <LineChart data={results.results ?? []} />
      </div>
      <div className="flex md:flex-row flex-col flex-1 gap-2">
        <div className="flex-1 shadow-sm border p-3 rounded-md bg-white">
          <BarChart data={results.results ?? []} />

          {thisMonthData && <BarChartThisMonth data={thisMonthData} />}
        </div>
        <div className="flex-1 shadow-sm border p-3 rounded-md bg-white">
          <PieChart data={results.results ?? []} />
        </div>
      </div>
    </div>
  );
}
