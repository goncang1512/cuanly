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
  }
);

export default function NavContextProvider({
  children,
}: {
  children: React.ReactNode;
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
      }}
    >
      {children}
    </NavContext.Provider>
  );
}

export const BottomContext = createContext(
  {} as {
    myWallet?: WalletType[] | null;
    loadingGet?: boolean;
  }
);

export const BottomContextProvider = ({
  children,
  myWallet,
  loadingGet,
}: {
  children: React.ReactNode;
  myWallet?: WalletType[] | null;
  loadingGet?: boolean;
}) => {
  return (
    <BottomContext.Provider value={{ myWallet, loadingGet }}>
      {children}
    </BottomContext.Provider>
  );
};
