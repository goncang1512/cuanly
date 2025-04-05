"use client";
import { useGlobalState } from "@/lib/context/GlobalContext";
import { WalletType } from "@/lib/types";
import { Eye, EyeOff } from "lucide-react";
import React from "react";

export default function AssetShow({
  query,
  wallet: allWallet,
}: {
  query: string;
  wallet: WalletType[] | [];
}) {
  const { setSeeSaldo, seeSaldo } = useGlobalState();

  const totalBalance = Array.isArray(allWallet)
    ? allWallet.reduce((acc, wallet) => acc + wallet.balance, 0)
    : 0;

  const assetName = query === "all" ? "All" : query === "group" ? "Our" : "My";

  return (
    <div className="bg-white shadow-sm rounded-sm p-3 flex justify-between px-5">
      <p>{assetName} assets</p>
      <div className="flex items-center gap-2">
        <p className="font-medium">
          {seeSaldo ? "Rp ----" : `Rp${totalBalance.toLocaleString("id-ID")}`}
        </p>

        <button onClick={() => setSeeSaldo((prev) => !prev)}>
          {seeSaldo ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}
