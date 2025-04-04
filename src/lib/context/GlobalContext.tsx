"use client";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export const GlobalContext = createContext(
  {} as {
    seeSaldo: boolean;
    setSeeSaldo: Dispatch<SetStateAction<boolean>>;
  }
);

export default function GlobalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seeSaldo, setSeeSaldo] = useState(true);
  return (
    <GlobalContext.Provider value={{ seeSaldo, setSeeSaldo }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalState = () => useContext(GlobalContext);
