"use client";
import React, { createContext, useOptimistic } from "react";
import { TransactionType, WalletType } from "../types";
import { generateId } from "better-auth";
import { FormTypeTrans } from "@/components/WalletPage/params/FormAddMoney";
import { authClient } from "../auth-client";
import { toast } from "sonner";
import { $Enums } from "@prisma/client";

interface WalletInterface {
  transaction?: TransactionType[] | null;
  addOptimisticTrans: (action: TransactionType) => void;
  optimisticTrans?: TransactionType[] | null;
  handleAction: (
    formData: FormData,
    formValue: FormTypeTrans,
    typeTransaction: string,
    wallet: WalletType | null,
    formAction: (formData: FormData) => void,
    walletPick?: WalletType | null
  ) => void;
  deleteTransaction: (
    formData: FormData,
    formAction: (formData: FormData) => void,
    trans_id: string
  ) => void;
  optimisticValue?: number;
  updateAmount: (action: string) => void;
}

export const WalletContext = createContext({} as WalletInterface);

function WalletContextProvider({
  children,
  transaction,
  walletNew,
}: {
  children: React.ReactNode;
  transaction?: TransactionType[] | null;
  walletNew?: WalletType | null;
}) {
  const session = authClient.useSession();
  const [optimisticTrans, addOptimisticTrans] = useOptimistic(
    transaction ?? [],
    (state, newTransaction: TransactionType & { actionType?: string }) => {
      if (newTransaction.actionType === "edit") {
        return state.map((t) =>
          t.id === newTransaction.id ? { ...t, ...newTransaction } : t
        );
      }
      return [newTransaction, ...state];
    }
  );

  const [optimisticValue, updateAmount] = useOptimistic(
    walletNew?.balance,
    (state, newState) => {
      return Number(newState);
    }
  );

  const handleAction = (
    formData: FormData,
    formValue: FormTypeTrans,
    typeTransaction: string,
    wallet: WalletType | null,
    formAction: (formData: FormData) => void,
    walletPick?: WalletType | null
  ) => {
    formData.append("amount", formValue.rawValue);
    formData.append("user_id", String(session?.data?.user?.id));
    formData.append("type", typeTransaction);

    if (typeTransaction === "move") {
      formData.append("from_id", String(wallet?.id));
      formData.append("to_id", formValue.pickCategory);
    } else {
      formData.append("category", formValue.pickCategory);
      formData.append("wallet_id", String(wallet?.id));
    }

    if (
      typeTransaction !== "add" &&
      String(wallet?.category) !== "receivable" &&
      Number(formValue.rawValue) > Number(wallet?.balance)
    ) {
      toast("Balance is not sufficient for transaction", {
        description: "Top up your balance again",
      });

      return;
    }

    let addMoney: number = 0;
    if (typeTransaction === "add") {
      addMoney += Number(formValue?.rawValue);
    } else {
      addMoney -= Number(formValue?.rawValue);
    }
    updateAmount(addMoney);

    addOptimisticTrans({
      id: generateId(32),
      category: typeTransaction === "move" ? "savings" : formValue.pickCategory,
      balance: Number(formValue.rawValue),
      type: typeTransaction as $Enums.TransType,
      description: String(formData.get("description")),
      userId: "goncang",
      actionType: "new",
      walletId: String(walletPick?.id),
      fromId: String(walletNew?.id),
      wallet: walletPick,
      fromWallet: walletNew,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "aktif",
    });

    formAction(formData);
  };

  const deleteTransaction = async (
    formData: FormData,
    formAction: (formData: FormData) => void,
    trans_id: string
  ) => {
    formData.append("trans_id", trans_id);

    formAction(formData);
  };

  return (
    <WalletContext.Provider
      value={{
        transaction: transaction ?? null,
        addOptimisticTrans,
        optimisticTrans,
        handleAction,
        deleteTransaction,
        optimisticValue,
        updateAmount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export default WalletContextProvider;
