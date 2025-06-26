"use client";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useOptimistic,
  useState,
} from "react";
import { TPlanning } from "../types";

export const PlanningContext = createContext(
  {} as {
    seeDrawerCreate: boolean;
    setDrawerCreate: Dispatch<SetStateAction<boolean>>;
    planning?: TPlanning[] | null;
    planningOptimis: TPlanning[];
    addPlanning: (action: TPlanning & { action?: string }) => void;
    filterPlanning: TPlanning[];
    setFilterPlanning: Dispatch<SetStateAction<TPlanning[]>>;
    handleClickDate: (date: Date) => void;
    filterPlanningByMonth: (selectedDate: Date) => void;
  }
);

export default function PlanningContextProvider({
  children,
  planning,
}: {
  children: React.ReactNode;
  planning?: TPlanning[] | null;
}) {
  const [seeDrawerCreate, setDrawerCreate] = useState(false);
  const [filterPlanning, setFilterPlanning] = useState<TPlanning[]>([]);
  const [planningOptimis, addPlanning] = useOptimistic(
    planning || [],
    (state: TPlanning[], newState: TPlanning & { action?: string }) => {
      return [newState, ...state];
    }
  );

  const handleClickDate = (date: Date) => {
    const selectedDate = new Date(date);
    const matchedPlanning: TPlanning[] = [];

    for (const plan of planningOptimis || []) {
      const deadline = new Date(plan.deadline);

      if (
        plan.recurrenceType === "weekly" &&
        deadline.getDay() === selectedDate.getDay()
      ) {
        matchedPlanning.push(plan);
      }

      if (
        plan.recurrenceType === "monthly" &&
        deadline.getDate() === selectedDate.getDate()
      ) {
        matchedPlanning.push(plan);
      }

      if (
        plan.recurrenceType === "yearly" &&
        deadline.getDate() === selectedDate.getDate() &&
        deadline.getMonth() === selectedDate.getMonth()
      ) {
        matchedPlanning.push(plan);
      }

      if (
        plan.recurrenceType === "onetime" &&
        deadline.toDateString() === selectedDate.toDateString()
      ) {
        matchedPlanning.push(plan);
      }
    }

    setFilterPlanning(matchedPlanning);
  };

  const filterPlanningByMonth = (selectedDate: Date) => {
    const matched: TPlanning[] = [];

    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    for (const plan of planningOptimis || []) {
      const deadline = new Date(plan.deadline);

      const isSameMonthAndYear =
        deadline.getMonth() === selectedMonth &&
        deadline.getFullYear() === selectedYear;

      const recurrence = plan.recurrenceType;

      if (recurrence === "onetime" && isSameMonthAndYear) {
        matched.push(plan);
      }

      // monthly: jika tanggalnya masih ada di bulan yang dimaksud
      if (recurrence === "monthly") {
        matched.push(plan);
      }

      // yearly: jika bulan sama
      if (recurrence === "yearly" && deadline.getMonth() === selectedMonth) {
        matched.push(plan);
      }

      // weekly: jika ada setidaknya satu hari di bulan ini yang cocok
      if (recurrence === "weekly") {
        const startOfMonth = new Date(selectedYear, selectedMonth, 1);
        const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

        for (
          let d = new Date(startOfMonth);
          d <= endOfMonth;
          d.setDate(d.getDate() + 1)
        ) {
          if (d.getDay() === deadline.getDay()) {
            matched.push(plan);
            break;
          }
        }
      }
    }

    setFilterPlanning(matched);
  };

  return (
    <PlanningContext.Provider
      value={{
        seeDrawerCreate,
        setDrawerCreate,
        planning,
        planningOptimis,
        addPlanning,
        filterPlanning,
        setFilterPlanning,
        handleClickDate,
        filterPlanningByMonth,
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
}
