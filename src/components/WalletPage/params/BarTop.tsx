"use client";
import { updateWallet } from "@/actions/wallet.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { iconFn, icons } from "@/lib/dynamicIcon";
import { WalletType } from "@/lib/types";
import { $Enums } from "@prisma/client";
import { ArrowLeft, Ellipsis, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function BarTop({ wallet }: { wallet?: WalletType | null }) {
  const router = useRouter();
  const [dialog, setDialog] = useState(false);

  return (
    <div className="bg-neutral-50 fixed z-50 top-0 left-0 w-full h-14 py-2 px-3 flex items-center justify-center">
      <div className="md:w-3xl w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()}>
            <ArrowLeft />
          </button>
          <h1 className="text-sm font-medium">Wallet details</h1>
        </div>
        <Drawer>
          <DrawerTrigger>
            <Ellipsis />
          </DrawerTrigger>
          <DrawerContent className="h-[50vh]">
            <DialogTitle hidden>Wallet context</DialogTitle>
            <div className="mx-auto w-full max-w-sm mt-2">
              {wallet?.name !== "Dompet Utama" && (
                <>
                  <button className="px-2 py-3 hover:bg-neutral-200 w-full text-start">
                    Delete wallet
                  </button>
                  <Dialog open={dialog} onOpenChange={setDialog}>
                    <DialogTrigger className="px-2 py-3 hover:bg-neutral-200 w-full text-start">
                      Edit Wallet
                    </DialogTrigger>
                    <UpdateWallet wallet={wallet} setDialog={setDialog} />
                  </Dialog>
                </>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

const UpdateWallet = ({
  wallet,
  setDialog,
}: {
  wallet?: WalletType | null;
  setDialog: Dispatch<SetStateAction<boolean>>;
}) => {
  const [message, setMessage] = useState("");
  const { formAction, formValue, setFormValue, isPending, state } =
    useFormActionState(updateWallet, {
      name: "",
      category: "",
      icon: "",
      type: "",
    });

  useEffect(() => {
    setFormValue({
      name: wallet?.name,
      category: wallet?.category,
      icon: wallet?.kategori,
      type: wallet?.type,
    });
  }, [wallet]);

  useEffect(() => {
    if (!state.status && state?.statusCode === 422) {
      setMessage(state.message);
    }

    if (state?.status) {
      setDialog(false);
    }
  }, [state, isPending]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit wallet</DialogTitle>
        <DialogDescription className="text-sm text-red-500">
          {message}
        </DialogDescription>
      </DialogHeader>
      <form
        action={(formData) => {
          formData.append("wallet_id", String(wallet?.id));
          formAction(formData);
        }}
        className="flex flex-col gap-3"
      >
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            value={formValue.name}
            onChange={(e) =>
              setFormValue({ ...formValue, name: e.target.value })
            }
            type="text"
            id="name"
            name="name"
            placeholder="Dompet utama"
            required
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="category">Category</Label>
          <Select
            required
            name="category"
            value={formValue.category}
            onValueChange={(e) => setFormValue({ ...formValue, category: e })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {["default", "debt", "receivable", "investment", "asset"].map(
                  (data: string, index) => (
                    <SelectItem value={data} key={index} className="capitalize">
                      {data}
                    </SelectItem>
                  )
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="icon">Icon</Label>
          <Select
            required
            name="newicon"
            value={formValue.icon}
            onValueChange={(e) => setFormValue({ ...formValue, icon: e })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a icon" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {icons.map((data, index) => {
                  const { Icon } = iconFn(data?.key);
                  return (
                    <SelectItem
                      className="capitalize"
                      value={data?.key}
                      key={index}
                    >
                      <Icon /> {data?.key.split("-")[1] ?? data?.key}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="type">Jenis</Label>
          <Select
            value={formValue.type}
            onValueChange={(e) =>
              setFormValue({ ...formValue, type: e as $Enums.TypeWallet })
            }
            name="type"
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="self">Self</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button disabled={isPending}>
          {isPending ? (
            <LoaderCircle size={20} className="animate-spin" />
          ) : (
            "Edit"
          )}
        </Button>
      </form>
    </DialogContent>
  );
};
