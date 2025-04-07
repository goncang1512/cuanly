"use client";
import { adjestAmount } from "@/actions/wallet.action";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGlobalState } from "@/lib/context/GlobalContext";
import { WalletContext } from "@/lib/context/WalletContext";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { iconFn } from "@/lib/dynamicIcon";
import { WalletType } from "@/lib/types";
import { generateId } from "better-auth";
import { Ellipsis, Eye, EyeOff, Pencil } from "lucide-react";
import React, { useContext, useEffect, useOptimistic, useState } from "react";

export function TopDetail({ wallet }: { wallet: WalletType | null }) {
  const { seeSaldo, setSeeSaldo } = useGlobalState();
  const [seeDrawer, setSeeDrawer] = useState(false);
  const { addOptimisticTrans } = useContext(WalletContext);
  const { Icon } = iconFn(String(wallet?.kategori));
  const { formAction, isPending, setFormValue, formValue } = useFormActionState(
    adjestAmount,
    {
      amount: "",
      rawAmount: "",
    }
  );

  useEffect(() => {
    if (isPending) {
      setSeeDrawer(false);
    }
  }, [isPending]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "");

    setFormValue({
      ...formValue,
      amount: numeric ? Number(numeric).toLocaleString("id-ID") : "",
      rawAmount: numeric,
    });
  };

  const [optimisticValue, updateAmount] = useOptimistic(
    wallet?.balance,
    (state, newState) => {
      return Number(newState);
    }
  );

  const handleUpdateAmount = (formData: FormData) => {
    formData.append("wallet_id", String(wallet?.id));
    formData.append("balance", String(formValue.rawAmount));

    updateAmount(formValue.rawAmount);

    addOptimisticTrans({
      id: generateId(32),
      description: "Amount adjustment",
      category: "adjest-balance",
      balance: Number(formValue.rawAmount),
      type: "adjust",
      status: "aktif",
      userId: "goncang",
      walletId: String(wallet?.id),
      fromId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    formAction(formData);
  };

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
            : `Rp${optimisticValue?.toLocaleString("id-ID") ?? "0"}`}
        </p>
        <Popover>
          <PopoverTrigger>
            <Ellipsis size={24} />
          </PopoverTrigger>
          <PopoverContent className="w-3xs">
            <button
              onClick={() => setSeeSaldo((prev) => !prev)}
              className="flex items-center gap-2"
            >
              {seeSaldo ? <EyeOff size={20} /> : <Eye size={20} />}{" "}
              {seeSaldo ? "Hide" : "Show"}
            </button>
            <Drawer open={seeDrawer} onOpenChange={setSeeDrawer}>
              <DrawerTrigger className="flex items-center gap-2">
                <Pencil size={20} /> Adjustment
              </DrawerTrigger>
              <DrawerContent className="h-[50vh]">
                <DialogTitle hidden>Adjust Amount balance</DialogTitle>
                <form
                  action={handleUpdateAmount}
                  className="mx-auto w-full max-w-md mt-2 flex flex-col gap-3"
                >
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="jumlah">Amount</Label>
                    <div className="relative flex-1">
                      <Input
                        autoFocus
                        value={formValue.amount}
                        onChange={handleChange}
                        id="jumlah"
                        accept="numeric"
                        name="jumlah"
                        className="pl-8"
                        type="text"
                        required
                        placeholder="Amount transaction"
                      />
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400">
                        Rp
                      </span>
                    </div>
                  </div>
                  <Button className="w-full">Adjesment Amount</Button>
                </form>
              </DrawerContent>
            </Drawer>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
