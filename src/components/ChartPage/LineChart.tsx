"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

// 🧠 Register components here
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  PointElement,
  LineElement,
  Legend,
  ArcElement
);

export type LabelType = {
  label?: string;
  income: number;
  expand: number;
  transfer: number;
};

export default function LineChart({ data: result }: { data: LabelType[] }) {
  const data = {
    labels: result.map((item) => item.label),
    datasets: [
      {
        label: "Income",
        data: result.map((item) => item.income),
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        tension: 0.3,
      },
      {
        label: "Expand",
        data: result.map((item) => item.expand),
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        tension: 0.3,
      },
      {
        label: "Transfer",
        data: result.map((item) => item.transfer),
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Financial Trends Over Time",
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
