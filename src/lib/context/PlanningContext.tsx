"use client";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

export const PlanningContext = createContext(
  {} as {
    seeDrawerCreate: boolean;
    setDrawerCreate: Dispatch<SetStateAction<boolean>>;
  }
);

export default function PlanningContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seeDrawerCreate, setDrawerCreate] = useState(false);
  return (
    <PlanningContext.Provider value={{ seeDrawerCreate, setDrawerCreate }}>
      {children}
    </PlanningContext.Provider>
  );
}
