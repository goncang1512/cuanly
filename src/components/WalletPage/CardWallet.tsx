"use client";
import React from "react";
import { Card } from "../ui/card";
import { WalletType } from "@/lib/types";
import { iconFn } from "@/lib/dynamicIcon";
import { useGlobalState } from "@/lib/context/GlobalContext";
import Link from "next/link";

export default function CardWallet({ wallet }: { wallet: WalletType | null }) {
  const Icon = iconFn(String(wallet?.kategori));
  const { seeSaldo } = useGlobalState();

  return (
    <Card className="h-32 p-0 overflow-hidden border-0">
      <Link
        href={`/wallet/${wallet?.id}`}
        className="items-center flex-col gap-1 justify-between h-full flex p-2"
      >
        <div className="flex justify-start w-full size-12">
          <Icon size={50} strokeWidth={1.3} />
        </div>
        <div className="flex leading-4 flex-col justify-start pl-1.5 items-start w-full">
          <p className="font-medium text-start w-full">{wallet?.name}</p>
          <span className="text-start text-sm text-neutral-700">
            {seeSaldo
              ? "Rp ----"
              : `Rp${wallet?.balance.toLocaleString("id-ID")}`}
          </span>
        </div>
      </Link>
    </Card>
  );
}
