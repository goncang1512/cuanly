import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { Card } from "../ui/card";
import { ArrowRight, LoaderCircle, Plus } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { WalletType } from "@/lib/types";
import { iconFn } from "@/lib/dynamicIcon";
import { BottomContext } from "@/lib/context/NavContext";
import { FormMoveMoney } from "./FormMoveMoney";

export default function TransMoney() {
  const [pickWallet, setPickWallet] = useState<WalletType>();
  const [pickToWallet, setPickToWallet] = useState<WalletType>();

  const { Icon, iconData } = iconFn(String(pickWallet?.kategori));
  const { Icon: ComIcon, iconData: dataIcon } = iconFn(
    String(pickToWallet?.kategori)
  );

  return (
    <div className="grid grid-cols-3 pt-5 md:px-0 px-3">
      <PickWallet setPickWallet={setPickWallet}>
        <Card className="flex flex-col gap-1 justify-center items-center bg-neutral-50">
          {pickWallet ? (
            <div
              style={{ backgroundColor: iconData?.color }}
              className="rounded-full size-12 flex items-center justify-center"
            >
              <Icon size={35} />
            </div>
          ) : (
            <div
              style={{ backgroundColor: iconData?.color }}
              className="rounded-full size-12 flex items-center justify-center"
            >
              <Plus className="bg-emerald p-1 rounded-full size-12" size={40} />
            </div>
          )}
          <p>{pickWallet?.name ?? "Choose"}</p>
        </Card>
      </PickWallet>
      <div className="w-full h-full flex items-center justify-center">
        <ArrowRight size={40} />
      </div>
      <PickWallet setPickWallet={setPickToWallet}>
        <Card className="flex flex-col gap-1 justify-center items-center bg-neutral-50">
          {pickToWallet ? (
            <div
              style={{ backgroundColor: dataIcon?.color }}
              className="rounded-full size-12 flex items-center justify-center"
            >
              <ComIcon size={35} />
            </div>
          ) : (
            <div className="rounded-full size-12 flex items-center justify-center">
              <Plus className="bg-emerald p-1 rounded-full size-12" size={40} />
            </div>
          )}
          <p className="capitalize">{pickToWallet?.name ?? "Choose"}</p>
        </Card>
      </PickWallet>
      <FormMoveMoney
        pickWallet={pickWallet}
        pickToWallet={pickToWallet}
        setPickToWallet={setPickToWallet}
        setPickWallet={setPickWallet}
      />
    </div>
  );
}

export const PickWallet = ({
  children,
  setPickWallet,
}: {
  setPickWallet: Dispatch<SetStateAction<WalletType | undefined>>;
  children: React.ReactNode;
}) => {
  const [seeDrawer, setSeeDrawer] = useState(false);
  const { myWallet, loadingGet } = useContext(BottomContext);

  return (
    <Drawer open={seeDrawer} onOpenChange={(open) => setSeeDrawer(open)}>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent
        aria-describedby="drawer-three"
        buttonClose={false}
        className="h-[50vh] md:px-0 px-3"
      >
        <DrawerTitle className="bg-red-500 hidden">Card wallet</DrawerTitle>
        <ScrollArea className="mx-auto w-full max-w-sm h-full flex flex-col gap-2 pt-2 pr-4">
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
    </Drawer>
  );
};
