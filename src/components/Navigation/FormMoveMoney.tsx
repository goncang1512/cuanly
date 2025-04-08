import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle } from "../ui/drawer";
import { WalletType } from "@/lib/types";
import { NavContext } from "@/lib/context/NavContext";
import { Button } from "../ui/button";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { addMoneyWallet } from "@/actions/transaction.action";
import { Input } from "../ui/input";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export const FormMoveMoney = ({
  pickToWallet,
  pickWallet,
  setPickToWallet,
  setPickWallet,
}: {
  pickToWallet?: WalletType;
  pickWallet?: WalletType;
  setPickWallet: Dispatch<SetStateAction<WalletType | undefined>>;
  setPickToWallet: Dispatch<SetStateAction<WalletType | undefined>>;
}) => {
  const { setSeeDrawerOne, setSeeDrawerThree, seeDrawerThree } =
    useContext(NavContext);
  const pathname = usePathname();
  const session = authClient.useSession();

  const { formValue, setFormValue, formAction, isPending, state } =
    useFormActionState(addMoneyWallet, {
      amount: "",
      rawAmount: "",
      description: "",
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "");

    setFormValue({
      ...formValue,
      amount: numeric ? Number(numeric).toLocaleString("id-ID") : "",
      rawAmount: numeric,
    });
  };

  const handleMoveMoney = (formData: FormData) => {
    formData.append("user_id", String(session?.data?.user?.id));
    formData.append("from_id", String(pickWallet?.id));
    formData.append("to_id", String(pickToWallet?.id));
    formData.append("type", "move");
    formData.append("amount", String(formValue.rawAmount));
    formData.append("pathname", String(pathname));

    if (Number(formValue.rawAmount) > Number(pickWallet?.balance)) {
      toast("Balance is not sufficient for transaction", {
        description: "Top up your balance again",
      });

      return;
    }

    formAction(formData);
  };

  useEffect(() => {
    if (state?.status) {
      setSeeDrawerOne(false);
      setSeeDrawerThree(false);
      setPickToWallet(undefined);
      setPickWallet(undefined);
    }
  }, [state]);

  useEffect(() => {
    if (pickToWallet && pickWallet) {
      if (pickToWallet.id === pickWallet.id) {
        toast("Fund transfer cannot be in the same wallet", {
          description: "Choose a different wallet",
        });
        setPickToWallet(undefined);
        return;
      }
      setSeeDrawerThree(true);
    }
  }, [pickToWallet, pickWallet]);

  return (
    <Drawer
      open={seeDrawerThree}
      onOpenChange={setSeeDrawerThree}
      onClose={() => {
        setPickToWallet(undefined);
      }}
    >
      <DrawerContent
        aria-describedby="drawer-two"
        classLay="bg-transparent"
        className="border-t h-[30vh] md:h-[60vh] data-[vaul-drawer-direction=bottom]:rounded-none md:px-0 px-3"
      >
        <DrawerTitle hidden>Add transaction</DrawerTitle>
        <form
          action={handleMoveMoney}
          className="mx-auto w-full max-w-sm px-3 md:px-0 flex flex-col gap-2 pt-2"
        >
          <div className="flex w-full items-center gap-1.5">
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
          <Input
            value={formValue.description}
            onChange={(e) =>
              setFormValue({ ...formValue, description: e.target.value })
            }
            name="description"
            placeholder="Description"
          />
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <LoaderCircle className="animate-spin" size={20} />
            ) : (
              "Add Transaction"
            )}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
