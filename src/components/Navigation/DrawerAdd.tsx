import React, {
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { X } from "lucide-react";
import FormAddTrans from "./FormAddTrans";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { iconFn, icons } from "@/lib/dynamicIcon";
import { BottomContextProvider, NavContext } from "@/lib/context/NavContext";
import TransMoney from "./TransMoney";
import { authClient } from "@/lib/auth-client";
import { getMyWalletTrans } from "@/actions/wallet.action";
import { WalletType } from "@/lib/types";

// DRAWER ONE 11111111
function DrawerAdd() {
  const { seeDrawerOne, setSeeDrawerOne, seeDrawerTwo, setSeeDrawerTwo } =
    useContext(NavContext);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSeeDrawerOne(false);
        setSeeDrawerTwo({
          show: false,
          type: "",
        });
      }
    };

    if (seeDrawerOne || seeDrawerTwo) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [seeDrawerOne, seeDrawerTwo]);

  const [state, formAcion, isPending] = useActionState(getMyWalletTrans, null);

  const session = authClient.useSession();
  useEffect(() => {
    if (!session?.data?.user?.id || !seeDrawerOne) return;

    const formData = new FormData();
    formData.append("user_id", String(session.data.user.id));

    startTransition(() => {
      formAcion(formData);
    });
  }, [session?.data?.user?.id, seeDrawerOne]);

  return (
    <BottomContextProvider
      myWallet={state?.results as WalletType[]}
      loadingGet={isPending}
    >
      <Drawer
        open={seeDrawerOne}
        onOpenChange={(open) => setSeeDrawerOne(open)}
      >
        <DrawerTrigger asChild>
          <button className="bg-emerald hover:bg-dark-emerald absolute -top-3 left-1/2 transform -translate-x-1/2 size-12 flex items-center justify-center text-white rounded-full">
            <svg
              className="size-8 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14m-7 7V5"
              />
            </svg>
          </button>
        </DrawerTrigger>
        <DrawerContent
          aria-describedby="drawer-one"
          buttonClose={false}
          className="data-[vaul-drawer-direction=bottom]:max-h-[100vh] data-[vaul-drawer-direction=bottom]:rounded-none data-[vaul-drawer-direction=bottom]:border-0"
        >
          <DrawerHeader className="bg-emerald flex justify-center">
            <button
              onClick={() => setSeeDrawerOne(false)}
              className="absolute right-3 top-2"
            >
              <X />
            </button>
            <DrawerTitle className="text-center">Add Transaction</DrawerTitle>
          </DrawerHeader>
          <div className="w-full h-screen">
            <TabsTransactionDraw />
          </div>
        </DrawerContent>
      </Drawer>
    </BottomContextProvider>
  );
}

export const TabsTransactionDraw = () => {
  const [pickCategory, setPickCategory] = useState("");
  const { setSeeDrawerTwo, seeDrawerTwo } = useContext(NavContext);
  return (
    <Tabs defaultValue="income">
      <div className="bg-emerald w-full flex py-4 justify-center">
        <TabsList className="w-full max-w-md mx-auto bg-transparent md:px-0 px-3">
          <TabsTrigger
            value="income"
            className="data-[state=active]:text-emerald-700"
          >
            Income
          </TabsTrigger>
          <TabsTrigger
            value="expand"
            className="data-[state=active]:text-emerald-700"
          >
            Expend
          </TabsTrigger>
          <TabsTrigger
            value="transfer"
            className="data-[state=active]:text-emerald-700"
          >
            Transfer
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="w-full max-w-md mx-auto">
        <TabsContent value="income">
          <div className="grid grid-cols-3 gap-3">
            {icons.map((data, index) => {
              const { Icon } = iconFn(data?.key);
              return (
                <div
                  key={index}
                  onClick={() => {
                    setPickCategory(data?.key);
                    setSeeDrawerTwo({
                      ...seeDrawerTwo,
                      show: true,
                      type: "add",
                    });
                  }}
                  className="flex flex-col gap-1 items-center justify-center cursor-pointer"
                >
                  <div
                    className={`${
                      pickCategory === data?.key
                        ? "bg-emerald"
                        : "bg-neutral-200"
                    } p-2 size-10  rounded-full flex items-center justify-center`}
                  >
                    <Icon size={40} />
                  </div>
                  <p className="capitalize">
                    {data?.key.split("-")[1] ?? data?.key}
                  </p>
                </div>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="expand">
          <div className="grid grid-cols-3 gap-3">
            {icons.map((data, index) => {
              const { Icon } = iconFn(data?.key);
              return (
                <div
                  onClick={() => {
                    setPickCategory(data?.key);
                    setSeeDrawerTwo({ show: true, type: "pay" });
                  }}
                  key={index}
                  className="flex flex-col gap-1 items-center justify-center cursor-pointer"
                >
                  <div
                    className={`${
                      pickCategory === data?.key
                        ? "bg-emerald"
                        : "bg-neutral-200"
                    } p-2 size-10  rounded-full flex items-center justify-center`}
                  >
                    <Icon size={40} />
                  </div>
                  <p className="capitalize">
                    {data?.key.split("-")[1] ?? data?.key}
                  </p>
                </div>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="transfer">
          <TransMoney />
        </TabsContent>
      </div>
      <FormAddTrans
        typeTrans={seeDrawerTwo.type}
        setPickCategory={setPickCategory}
        category={pickCategory}
      />
    </Tabs>
  );
};

export default DrawerAdd;
