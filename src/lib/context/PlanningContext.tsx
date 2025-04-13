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
    addPlanning: (action: TPlanning) => void;
    filterPlanning: TPlanning[];
    setFilterPlanning: Dispatch<SetStateAction<TPlanning[]>>;
    handleClickDate: (date: Date) => void;
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
    (state: TPlanning[], newState: TPlanning) => {
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
        plan.recurrenceType === "ontime" &&
        deadline.toDateString() === selectedDate.toDateString()
      ) {
        matchedPlanning.push(plan);
      }
    }

    setFilterPlanning(matchedPlanning);
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
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
}
