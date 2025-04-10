"use client";
import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { LabelType } from "./LineChart";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({
  data,
  type = "month",
  showButton = true,
}: {
  data: LabelType[];
  type?: "month" | "year";
  showButton?: boolean;
}) {
  const [mode, setMode] = useState<"month" | "year">(type);

  // Ambil bulan dan tahun dari bulan terakhir
  const lastDate = new Date();
  const targetMonth = lastDate.getMonth();
  const targetYear = lastDate.getFullYear();

  // Filter data sesuai mode
  const filteredData = data.filter((item) => {
    const itemDate = new Date(`${item.label} 1, ${targetYear}`); // Misal "Apr 1, 2025"
    return mode === "month"
      ? itemDate.getMonth() === targetMonth
      : itemDate.getFullYear() === targetYear;
  });

  // Hitung total
  const totalIncome = filteredData.reduce((sum, item) => sum + item.income, 0);
  const totalExpand = filteredData.reduce((sum, item) => sum + item.expand, 0);
  const totalTransfer = filteredData.reduce(
    (sum, item) => sum + item.transfer,
    0
  );

  const totalAll = totalIncome + totalExpand + totalTransfer;

  const percent = (value: number) =>
    totalAll === 0 ? 0 : ((value / totalAll) * 100).toFixed(1);

  return (
    <div className="w-full max-w-md mx-auto">
      {showButton && (
        <div className="flex justify-center mb-4 gap-2">
          <button
            className={`px-4 py-1 rounded ${
              mode === "month" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode("month")}
          >
            Month
          </button>
          <button
            className={`px-4 py-1 rounded ${
              mode === "year" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode("year")}
          >
            Year
          </button>
        </div>
      )}

      <Pie
        data={{
          labels: ["Income", "Expand", "Transfer"],
          datasets: [
            {
              label: "Financial Flow (%)",
              data: [
                Number(percent(totalIncome)),
                Number(percent(totalExpand)),
                Number(percent(totalTransfer)),
              ],
              backgroundColor: ["#10b981", "#ef4444", "#3b82f6"],
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
            title: {
              display: true,
              text: `Transaction Pie Chart (${
                mode === "month" ? "this month" : "this year"
              })`,
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const label = tooltipItem.label || "";
                  const value = tooltipItem.raw as number;
                  return `${label}: ${value}%`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}

export function PieChartMonth({ data }: { data: LabelType }) {
  const totalAll = data.income + data.expand + data.transfer;

  const percent = (value: number) =>
    totalAll === 0 ? 0 : ((value / totalAll) * 100).toFixed(1);

  return (
    <div className="w-full max-w-md mx-auto">
      <Pie
        data={{
          labels: ["Income", "Expand", "Transfer"],
          datasets: [
            {
              label: "Financial Flow (%)",
              data: [
                Number(percent(data?.income)),
                Number(percent(data?.expand)),
                Number(percent(data?.transfer)),
              ],
              backgroundColor: ["#10b981", "#ef4444", "#3b82f6"],
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
            title: {
              display: true,
              text: "Transaction Pie Chart (this month)",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const label = tooltipItem.label || "";
                  const value = tooltipItem.raw as number;
                  return `${label}: ${value}%`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
