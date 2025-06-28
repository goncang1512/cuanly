"use client";
import { getMyWallet } from "@/actions/wallet.action";
import { TabsContent } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { iconFn } from "@/lib/dynamicIcon";
import { WalletType } from "@/lib/types";
import React, {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
} from "react";
import { useGlobalState } from "@/lib/context/GlobalContext";
import { FormTypeTrans } from "./FormAddMoney";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export const TabsWallet = ({
  formValue,
  setFormValue,
  setWalletPick,
}: {
  formValue: FormTypeTrans;
  setFormValue: (updatedFields: Partial<FormTypeTrans>) => void;
  setWalletPick: Dispatch<SetStateAction<WalletType | null | undefined>>;
}) => {
  const params = useParams();
  const session = authClient.useSession();
  const { seeSaldo } = useGlobalState();

  const { formAction: getWallet, state: stateWallet } = useFormActionState(
    getMyWallet,
    null
  );

  useEffect(() => {
    if (!session?.data?.user?.id) return;

    const formData = new FormData();
    formData.append("user_id", String(session.data.user.id));

    startTransition(() => {
      getWallet(formData);
    });
  }, [session?.data?.user?.id]);

  return (
    <TabsContent value="card-kredit">
      <ScrollArea className="w-full h-[70vh] pt-2 pr-4 pb-5">
        <div className="grid grid-cols-2 gap-2">
          {((stateWallet?.results as WalletType[]) ?? [])?.map(
            (data: WalletType) => {
              const { Icon } = iconFn(String(data?.kategori));

              return (
                <Card
                  onClick={() => {
                    setFormValue({ ...formValue, pickCategory: data?.id });
                    setWalletPick(data);
                  }}
                  key={data.id}
                  className={`${
                    formValue.pickCategory === data?.id && "bg-emerald-400"
                  } ${
                    params?.wallet_id === data?.id && "hidden"
                  } cursor-pointer w-full h-32 p-0 overflow-hidden border`}
                >
                  <div className="items-center flex-col gap-1 justify-between h-full flex p-2">
                    <div className="flex justify-start w-full size-12">
                      <Icon size={50} strokeWidth={1.3} />
                    </div>
                    <div className="flex leading-4 flex-col justify-start pl-1.5 items-start w-full">
                      <p className="font-medium text-start w-full">
                        {data?.name}
                      </p>
                      <span className="text-start text-sm text-neutral-700">
                        {seeSaldo
                          ? "Rp ----"
                          : `Rp${data?.balance.toLocaleString("id-ID")}`}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            }
          )}
        </div>
      </ScrollArea>
    </TabsContent>
  );
};
