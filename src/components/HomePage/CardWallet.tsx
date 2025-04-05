"use client";
import { Check, Eye, EyeOff, Files } from "lucide-react";
import React, { useState } from "react";
import LastTransaction from "./LastTransaction";
import { TransactionType, WalletType } from "@/lib/types";
import { iconFn } from "@/lib/dynamicIcon";
import { useGlobalState } from "@/lib/context/GlobalContext";

export default function CardWallet({
  wallet,
  transaction,
}: {
  wallet: WalletType | null;
  transaction: TransactionType[];
}) {
  const { setSeeSaldo, seeSaldo } = useGlobalState();
  const [copied, setCopied] = useState(false);

  const handleCopy = (wallet_id: string) => {
    if (!wallet_id) return;
    navigator.clipboard.writeText(wallet_id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Reset setelah 1.5 detik
    });
  };

  const { Icon } = iconFn(String(wallet?.kategori));

  return (
    <div className="bg-emerald-100 rounded-md p-3 flex gap-3 flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon />
          <div>
            <h1 className="font-semibold text-neutral-800">{wallet?.name}</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-neutral-400">
                {wallet?.id.match(/.{1,4}/g)?.join(" ")}
              </p>
              <button
                disabled={copied}
                onClick={() => handleCopy(String(wallet?.id))}
              >
                {copied ? <Check size={15} /> : <Files size={15} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className="font-medium">
            {seeSaldo
              ? "Rp ----"
              : `Rp${wallet?.balance.toLocaleString("id-ID")}`}
          </p>
          <button onClick={() => setSeeSaldo((prev) => !prev)}>
            {seeSaldo ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <LastTransaction transaction={transaction} />
    </div>
  );
}
