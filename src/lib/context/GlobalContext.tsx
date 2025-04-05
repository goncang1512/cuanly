"use client";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
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

  useEffect(() => {
    const stored = localStorage.getItem("seeSaldo");
    if (stored !== null) {
      setSeeSaldo(JSON.parse(stored));
    } else {
      localStorage.setItem("seeSaldo", JSON.stringify(false));
      setSeeSaldo(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("seeSaldo", JSON.stringify(seeSaldo));
  }, [seeSaldo]);
  return (
    <GlobalContext.Provider value={{ seeSaldo, setSeeSaldo }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalState = () => useContext(GlobalContext);
