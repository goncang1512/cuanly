"use client";
import { Eye, EyeOff, Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";
import LastTransaction from "./LastTransaction";

export default function CardWallet() {
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

  // setiap kali nilai berubah, update localStorage
  useEffect(() => {
    localStorage.setItem("seeSaldo", JSON.stringify(seeSaldo));
  }, [seeSaldo]);

  return (
    <div className="bg-emerald-100 rounded-md p-3 flex gap-3 flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet />
          <div>
            <h1 className="font-semibold text-neutral-800">Dompet</h1>
            <p className="text-xs text-neutral-400">2344 2312 2311</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className="font-medium">{seeSaldo ? "Rp ----" : `Rp100.000`}</p>
          <button onClick={() => setSeeSaldo((prev) => !prev)}>
            {seeSaldo ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <LastTransaction />
    </div>
  );
}
