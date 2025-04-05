"use client";
import { addMoneyWallet } from "@/actions/transaction.action";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { iconFn, icons } from "@/lib/dynamicIcon";
import { WalletType } from "@/lib/types";
import { LoaderCircle, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function FormAddMoney({
  wallet,
}: {
  wallet: WalletType | null;
}) {
  const session = authClient.useSession();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { formValue, setFormValue, isPending, formAction, state } =
    useFormActionState(addMoneyWallet, {
      displayValue: "",
      description: "",
      pickCategory: "",
    });
  const [rawValue, setRawValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "");

    setRawValue(numeric);
    setFormValue({
      ...formValue,
      displayValue: numeric ? Number(numeric).toLocaleString("id-ID") : "",
    });
  };

  const handleAction = async (formData: FormData) => {
    formData.append("amount", rawValue);
    formData.append("user_id", String(session?.data?.user?.id));
    formData.append("wallet_id", String(wallet?.id));
    formData.append("category", formValue.pickCategory);

    formAction(formData);
  };

  useEffect(() => {
    if (state?.status) {
      setOpenDrawer(false);
    }
  }, [state]);

  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
      <DrawerTrigger className="bg-emerald text-white size-10 rounded-full flex items-center justify-center">
        <Plus size={30} />
      </DrawerTrigger>
      <DrawerContent className="h-screen">
        <DialogTitle hidden>Add Money</DialogTitle>
        <div className="mx-auto w-full max-w-md mt-2 flex flex-col gap-3">
          <Tabs defaultValue="formData">
            <TabsList className="w-full">
              <TabsTrigger value="formData">Form</TabsTrigger>
              <TabsTrigger value="category">Category</TabsTrigger>
            </TabsList>
            <TabsContent value="formData">
              <form
                action={handleAction}
                className="w-full mt-2 flex flex-col gap-3"
              >
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="description">Description</Label>
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
                  <Label htmlFor="balance">Amount</Label>
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
                <Button disabled={isPending} type="submit">
                  {isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Add money"
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="category">
              <div className="grid grid-cols-3 gap-3 ">
                {icons?.map((data, index) => {
                  if (!data?.key?.startsWith("in-")) return null;
                  const { Icon } = iconFn(data?.key);
                  return (
                    <button
                      onClick={() =>
                        setFormValue({ ...formValue, pickCategory: data?.key })
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
                      <p className="capitalize">{data?.key.split("-")[1]}</p>
                    </button>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
