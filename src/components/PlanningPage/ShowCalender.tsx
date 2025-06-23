"use client";
import { PlanningContext } from "@/lib/context/PlanningContext";
import { getPlanningThisMonth, planningTime } from "@/lib/utils/planningtime";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import FilterPlanning from "./FilterPlanning";
import { CalendarDay } from "./CalenderDay";
import { CalendarHeader } from "./CalenderHeader";
import { RefreshCcw } from "lucide-react";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ShowCalendar() {
  const [date, setDate] = useState(new Date());
  const { planningOptimis, handleClickDate, filterPlanningByMonth } =
    useContext(PlanningContext);

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDay = new Date(firstDayOfMonth);
  startDay.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  const endDay = new Date(lastDayOfMonth);
  endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

  const changeMonth = useCallback(
    (offset: number) => {
      setDate(new Date(year, month + offset, 1));
    },
    [year, month]
  );

  const days = useMemo(() => {
    const tempDate = new Date(startDay);
    const result = [];

    while (tempDate <= endDay) {
      const current = new Date(tempDate);
      const isCurrentMonth = current.getMonth() === month;
      const { matchedPlanning } = planningTime(current, planningOptimis);
      const isToday = current.toDateString() === new Date().toDateString();

      result.push(
        <CalendarDay
          key={current.toISOString()}
          current={current}
          isCurrentMonth={isCurrentMonth}
          isToday={isToday}
          matchedPlanning={matchedPlanning}
          handleClickDate={handleClickDate}
        />
      );

      tempDate.setDate(tempDate.getDate() + 1);
    }

    return result;
  }, [planningOptimis, date]);

  const { totalPrice } = getPlanningThisMonth(planningOptimis, date);

  useEffect(() => {
    filterPlanningByMonth(date);
  }, [date]);

  return (
    <div>
      <div className="py-2 gap-5 flex w-full justify-end">
        <button onClick={() => filterPlanningByMonth(date)}>
          <RefreshCcw size={20} />
        </button>
        <h1 className="font-medium">
          Estimated Rp{totalPrice.toLocaleString("id-ID")}
        </h1>
      </div>
      <div className="w-full">
        <CalendarHeader
          month={month}
          year={year}
          onPrev={() => changeMonth(-1)}
          onNext={() => changeMonth(1)}
        />
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
