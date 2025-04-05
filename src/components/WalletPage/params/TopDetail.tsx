"use client";
import { useGlobalState } from "@/lib/context/GlobalContext";
import { iconFn } from "@/lib/dynamicIcon";
import { WalletType } from "@/lib/types";
import { Eye, EyeOff } from "lucide-react";
import React from "react";

export function TopDetail({ wallet }: { wallet: WalletType | null }) {
  const { seeSaldo, setSeeSaldo } = useGlobalState();
  const Icon = iconFn(String(wallet?.kategori));

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <Icon size={100} strokeWidth={1} />
      <p className="text-sm text-neutral-400">
        {wallet?.id.match(/.{1,4}/g)?.join(" ")}
      </p>
      <h1 className="font-medium text-xl text-neutral-800">{wallet?.name}</h1>
      <div className="flex items-center gap-2">
        <p className="font-semibold">
          {seeSaldo
            ? "Rp ----"
            : `Rp${wallet?.balance.toLocaleString("id-ID")}`}
        </p>
        <button onClick={() => setSeeSaldo((prev) => !prev)}>
          {seeSaldo ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}
