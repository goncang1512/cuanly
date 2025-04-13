"use client";
import { PlanningContext } from "@/lib/context/PlanningContext";
import { getPlanningThisMonth, planningTime } from "@/lib/utils/planningtime";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useContext, useState } from "react";
import FilterPlanning from "./FilterPlanning";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ShowCalendar() {
  const [date, setDate] = useState(new Date());
  const { planningOptimis, handleClickDate } = useContext(PlanningContext);

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDay = new Date(firstDayOfMonth);
  startDay.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  const endDay = new Date(lastDayOfMonth);
  endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

  const changeMonth = (offset: number) => {
    setDate(new Date(year, month + offset, 1));
  };

  const days = [];
  const tempDate = new Date(startDay);

  while (tempDate <= endDay) {
    const current = new Date(tempDate);
    const isCurrentMonth = current.getMonth() === month;
    const { matchedPlanning } = planningTime(current, planningOptimis);

    const isPrevOrNextMonth = !isCurrentMonth;

    days.push(
      <div
        key={current.toISOString()}
        onClick={() => handleClickDate(current)}
        className={`text-center p-2 border rounded cursor-pointer 
          ${isPrevOrNextMonth ? "text-gray-400" : ""}
          ${
            matchedPlanning
              ? isCurrentMonth
                ? "bg-emerald-600 text-white"
                : "bg-emerald-200 text-neutral-600"
              : ""
          }
        `}
      >
        {current.getDate()}
      </div>
    );

    tempDate.setDate(tempDate.getDate() + 1);
  }

  const { totalPrice } = getPlanningThisMonth(planningOptimis, date);

  return (
    <div>
      <div className="py-2 flex w-full justify-end">
        <h1 className="font-medium">
          Estimated Rp{totalPrice.toLocaleString("id-ID")}
        </h1>
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="px-3 py-1 bg-emerald text-white rounded"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-xl font-bold">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="px-3 py-1 bg-emerald text-white rounded"
          >
            <ArrowRight />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center font-semibold mb-2">
          {dayNames.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>

      {/* SCHEDULE */}
      <FilterPlanning />
    </div>
  );
}
