import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { addMoneyWallet } from "@/actions/transaction.action";
import { IdCard, LoaderCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { authClient } from "@/lib/auth-client";
import { iconFn } from "@/lib/dynamicIcon";
import { WalletType } from "@/lib/types";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { NavContext } from "@/lib/context/NavContext";
import { toast } from "sonner";

export default function FormAddTrans({
  category,
  children,
  typeTrans,
  setPickCategory,
}: {
  category: string;
  children: React.ReactNode;
  typeTrans: string;
  setPickCategory: Dispatch<SetStateAction<string>>;
}) {
  const session = authClient.useSession();
  const { seeDrawerTwo, setSeeDrawerTwo, setSeeDrawerOne } =
    useContext(NavContext);
  const pathname = usePathname();
  const [pickWallet, setPickWallet] = useState<WalletType>();
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

  const handleCraete = (formData: FormData) => {
    formData.append("category", category);
    formData.append("user_id", String(session?.data?.user?.id));
    formData.append("wallet_id", String(pickWallet?.id));
    formData.append("type", typeTrans);
    formData.append("amount", formValue.rawAmount);
    formData.append("pathname", pathname);

    if (!pickWallet?.id) {
      toast("No wallet selected", {
        description: "Select wallet to continue transaction",
      });

      return;
    } else if (Number(formValue.rawAmount) > Number(pickWallet?.balance)) {
      toast("Balance is not sufficient for transaction", {
        description: "Top up your balance again",
      });

      return;
    }

    formAction(formData);
  };

  useEffect(() => {
    if (state.status) {
      setSeeDrawerTwo(false);
      setSeeDrawerOne(false);
    }
  }, [state]);

  return (
    <Drawer
      onClose={() => {
        setPickCategory("");
        setPickWallet(undefined);
      }}
      onOpenChange={setSeeDrawerTwo}
      open={seeDrawerTwo}
    >
      <DrawerTrigger
        onClick={() => setPickCategory(category)}
        className="flex items-center justify-center"
      >
        {children}
      </DrawerTrigger>
      <DrawerContent
        classLay="bg-transparent"
        className="border-t h-[60vh] data-[vaul-drawer-direction=bottom]:rounded-none"
      >
        <DrawerTitle hidden>Add transaction</DrawerTitle>
        <form
          action={handleCraete}
          className="mx-auto w-full max-w-sm h-screen flex flex-col gap-2 pt-2"
        >
          <div className="flex w-full items-center gap-1.5">
            <PickWallet setPickWallet={setPickWallet} pickWallet={pickWallet} />
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
}

export const PickWallet = ({
  pickWallet,
  setPickWallet,
}: {
  pickWallet?: WalletType;
  setPickWallet: Dispatch<SetStateAction<WalletType | undefined>>;
}) => {
  const [seeDrawer, setSeeDrawer] = useState(false);
  const { myWallet, loadingGet } = useContext(NavContext);

  const { Icon, iconData } = iconFn(String(pickWallet?.kategori));

  return (
    <Drawer onOpenChange={setSeeDrawer} open={seeDrawer}>
      <DrawerTrigger
        style={{ backgroundColor: iconData?.color ?? "" }}
        className={`${pickWallet ? "" : "bg-neutral-300"}  p-1 rounded-sm`}
      >
        {pickWallet ? <Icon size={25} /> : <IdCard size={25} />}
      </DrawerTrigger>
      <DrawerContent buttonClose={false}>
        <DrawerTitle hidden>Card wallet</DrawerTitle>
        <DrawerContent className="h-[50vh]">
          <ScrollArea className="mx-auto w-full max-w-sm h-screen flex flex-col gap-2 pt-2">
            {loadingGet ? (
              <div className="w-full flex justify-center">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : (
              myWallet?.map((data) => {
                const { Icon, iconData } = iconFn(data?.kategori);
                return (
                  <button
                    onClick={() => {
                      setPickWallet(data as WalletType);
                      setSeeDrawer(false);
                    }}
                    key={data.id}
                    className="py-2 flex justify-between w-full"
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        size={30}
                        className="p-1 rounded-md"
                        style={{ backgroundColor: iconData?.color }}
                      />
                      <h1 className="text-sm">{data?.name}</h1>
                    </div>
                    <p>Rp{data?.balance.toLocaleString("id-ID")}</p>
                  </button>
                );
              })
            )}
          </ScrollArea>
        </DrawerContent>
      </DrawerContent>
    </Drawer>
  );
};
