"use client";
import TransactionCard from "@/components/TransactionCard";
import { WalletContext } from "@/lib/context/WalletContext";
import { TransactionType } from "@/lib/types";
import React, { useContext } from "react";

export default function WalletTransaction() {
  const { optimisticTrans, transaction } = useContext(WalletContext);
  return (
    <div>
      {optimisticTrans?.map((data: TransactionType, index: number) => {
        return (
          <TransactionCard
            data={data}
            index={index}
            key={data?.id}
            banyak={transaction?.length}
          />
        );
      })}
    </div>
  );
}
