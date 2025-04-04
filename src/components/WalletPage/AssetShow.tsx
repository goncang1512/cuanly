"use client";
import { useGlobalState } from "@/lib/context/GlobalContext";
import { WalletType } from "@/lib/types";
import { Eye, EyeOff } from "lucide-react";
import React, { useEffect } from "react";

export default function AssetShow({ wallet }: { wallet: WalletType | null }) {
  const { setSeeSaldo, seeSaldo } = useGlobalState();

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
    <div className="bg-white shadow-sm rounded-sm p-3 flex justify-between px-5">
      <p>My assets</p>
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
  );
}
