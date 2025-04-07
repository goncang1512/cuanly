"use client";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { WalletType } from "../types";

export const NavContext = createContext(
  {} as {
    seeDrawerOne: boolean;
    setSeeDrawerOne: Dispatch<SetStateAction<boolean>>;
    seeDrawerTwo: boolean;
    setSeeDrawerTwo: Dispatch<SetStateAction<boolean>>;
    seeDrawerThree: boolean;
    setSeeDrawerThree: Dispatch<SetStateAction<boolean>>;
    myWallet?: WalletType[] | null;
    loadingGet?: boolean;
  }
);

export default function NavContextProvider({
  children,
  myWallet,
  loadingGet,
}: {
  children: React.ReactNode;
  myWallet?: WalletType[] | null;
  loadingGet?: boolean;
}) {
  const [seeDrawerOne, setSeeDrawerOne] = useState(false);
  const [seeDrawerTwo, setSeeDrawerTwo] = useState(false);
  const [seeDrawerThree, setSeeDrawerThree] = useState(false);

  return (
    <NavContext.Provider
      value={{
        seeDrawerOne,
        setSeeDrawerOne,
        seeDrawerTwo,
        setSeeDrawerTwo,
        seeDrawerThree,
        setSeeDrawerThree,
        myWallet,
        loadingGet,
      }}
    >
      {children}
    </NavContext.Provider>
  );
}
