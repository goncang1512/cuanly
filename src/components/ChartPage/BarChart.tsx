"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { LabelType } from "./LineChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ data }: { data: LabelType[] }) {
  return (
    <Bar
      data={{
        labels: data.map((item) => item.label),
        datasets: [
          {
            label: "Income",
            data: data.map((item) => item.income),
            backgroundColor: "#10b981",
          },
          {
            label: "Expand",
            data: data.map((item) => item.expand),
            backgroundColor: "#ef4444",
          },
          {
            label: "Transfer",
            data: data.map((item) => item.transfer),
            backgroundColor: "#3b82f6",
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
            text: "Monthly Financial Overview",
          },
        },
      }}
    />
  );
}

export function BarChartThisMonth({ data }: { data: LabelType }) {
  return (
    <Bar
      data={{
        labels: ["Income", "Expand", "Transfer"],
        datasets: [
          {
            label: `This Month: ${data.label}`,
            data: [data.income, data.expand, data.transfer],
            backgroundColor: ["#10b981", "#ef4444", "#3b82f6"],
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Financial Overview (This Month)",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }}
    />
  );
}
