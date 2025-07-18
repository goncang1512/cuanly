"use client";
import { addMoneyWallet } from "@/actions/transaction.action";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { iconFn, icons } from "@/lib/dynamicIcon";
import { WalletType } from "@/lib/types";
import { $Enums } from "@prisma/client";
import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/lib/context/WalletContext";
import { TabsWallet } from "./MoveSaldo";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/language/useLanguage";

export type FormTypeTrans = {
  displayValue: string;
  description: string;
  pickCategory: string;
  rawValue: string;
  method: string;
};

const dataForm = {
  rawValue: "",
  displayValue: "",
  description: "",
  pickCategory: "",
  method: "",
};

export default function FormAddMoney({
  children,
  wallet,
  typeTransaction,
}: {
  children: React.ReactNode;
  wallet: WalletType | null;
  typeTransaction: $Enums.TransType;
}) {
  const [seeDrawer, setSeeDrawer] = useState(false);
  const { lang } = useTranslation();
  const [walletPick, setWalletPick] = useState<WalletType | null | undefined>();
  const { handleAction } = useContext(WalletContext);
  const { state, formValue, setFormValue, isPending, formAction } =
    useFormActionState<FormTypeTrans>(addMoneyWallet, dataForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "");

    setFormValue({
      ...formValue,
      displayValue: numeric ? Number(numeric).toLocaleString("id-ID") : "",
      rawValue: numeric,
    });
  };

  useEffect(() => {
    if (state.status) {
      setSeeDrawer(false);
      setFormValue(dataForm);
    }
  }, [isPending, state.status]);

  return (
    <Drawer open={seeDrawer} onOpenChange={setSeeDrawer}>
      {children}
      <DrawerContent className={`h-screen`}>
        <DialogTitle hidden>Add Money</DialogTitle>
        <div className="mx-auto w-full max-w-md mt-2 md:px-0 px-3 flex flex-col gap-3">
          <Tabs defaultValue="formData">
            <TabsList className="w-full">
              <TabsTrigger value="formData">Form</TabsTrigger>
              {typeTransaction !== "move" && (
                <TabsTrigger value="category">
                  {lang.wallet_detail.create_transaction.category}
                </TabsTrigger>
              )}
              {typeTransaction === "move" && (
                <TabsTrigger value="card-kredit">
                  {lang.wallet_page.title}
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="formData">
              <form
                action={(formData) => {
                  handleAction(
                    formData,
                    formValue,
                    typeTransaction === "pay"
                      ? (formData.get("methodpay") as string)
                      : typeTransaction,
                    wallet,
                    formAction,
                    walletPick
                  );
                }}
                className="w-full mt-2 flex flex-col gap-3"
              >
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="description">
                    {lang.wallet_detail.create_transaction.description}
                  </Label>
                  <Input
                    value={formValue.description}
                    onChange={(e) =>
                      setFormValue({
                        ...formValue,
                        description: e.target.value,
                      })
                    }
                    type="text"
                    id="description"
                    name="description"
                    placeholder="description"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="balance">
                    {lang.wallet_detail.create_transaction.amount}
                  </Label>
                  <div className="relative flex-1">
                    <Input
                      value={formValue.displayValue}
                      onChange={handleChange}
                      id="balance"
                      accept="numeric"
                      name="balance"
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
                {typeTransaction === "pay" && (
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="description">
                      {lang.wallet_detail.create_transaction.method}
                    </Label>
                    <Select
                      value={formValue.method}
                      onValueChange={(val) =>
                        setFormValue({ ...formValue, method: val })
                      }
                      name="methodpay"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="pay">Pay</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button type="submit">
                  {typeTransaction === "add"
                    ? "Add money"
                    : ["transfer", "pay"].includes(typeTransaction)
                    ? "Pay"
                    : "Move balance"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="category">
              <ScrollArea className="pb-3 h-screen w-full">
                <div className="grid grid-cols-3 w-full">
                  {icons?.map((data, index) => {
                    const { Icon } = iconFn(data?.key);
                    return (
                      <button
                        onClick={() =>
                          setFormValue({
                            ...formValue,
                            pickCategory: data?.key,
                          })
                        }
                        key={index}
                        className="flex flex-col gap-1 items-center justify-center"
                      >
                        <div
                          className={`${
                            formValue.pickCategory === data?.key
                              ? "bg-emerald"
                              : "bg-neutral-200"
                          }  p-2 size-10 rounded-full flex items-center justify-center`}
                        >
                          <Icon size={40} />
                        </div>
                        <p className="capitalize">
                          {data?.key.split("-")[1] ?? data?.key}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsWallet
              setWalletPick={setWalletPick}
              formValue={formValue}
              setFormValue={setFormValue}
            />
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
