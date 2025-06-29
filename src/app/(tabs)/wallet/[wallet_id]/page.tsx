import { detailWallet } from "@/actions/wallet.action";
import BarTop from "@/components/WalletPage/params/BarTop";
import FormAddMoney from "@/components/WalletPage/params/FormAddMoney";
import { TopDetail } from "@/components/WalletPage/params/TopDetail";
import { ArrowRight, ArrowUp, Plus } from "lucide-react";
import React from "react";
import { DrawerTrigger } from "@/components/ui/drawer";
import WalletContextProvider from "@/lib/context/WalletContext";
import WalletTransaction from "@/components/WalletPage/params/WalletTransaction";
import SearchTransaction from "@/components/WalletPage/params/SearchTransaction";
import { getTransaltion } from "@/language/getTranslation";

export default async function WalletDetail({
  params,
}: {
  params: Promise<{ wallet_id: string }>;
}) {
  const { wallet_id } = await params;
  const wallet = await detailWallet(wallet_id);
  const walletNew = wallet?.results?.wallet;
  const countWallet = wallet?.results?.countWallet;

  const lang = await getTransaltion();

  console.log(lang);

  return (
    <WalletContextProvider
      walletNew={walletNew}
      transaction={wallet?.results?.transaction}
    >
      <BarTop wallet={walletNew} />
      <div className="pt-14 h-full flex flex-col gap-3">
        <TopDetail wallet={walletNew ?? null} />

        <div className="flex justify-center gap-3">
          <div className="flex flex-col items-center w-max">
            <FormAddMoney typeTransaction="add" wallet={walletNew ?? null}>
              <DrawerTrigger className="bg-emerald text-white size-10 rounded-full flex items-center justify-center">
                <Plus size={30} />
              </DrawerTrigger>
            </FormAddMoney>

            <h1 className="text-sm font-medium">{lang.wallet_detail.add}</h1>
          </div>
          <div className="flex flex-col items-center w-max">
            <FormAddMoney typeTransaction="move" wallet={walletNew ?? null}>
              <DrawerTrigger
                disabled={
                  Number(countWallet) < 1 ||
                  Number(wallet?.results?.wallet?.balance) <= 0
                }
                className={`${
                  Number(countWallet) >= 1 &&
                  Number(wallet?.results?.wallet?.balance) > 0
                    ? "bg-emerald text-white"
                    : "bg-neutral-200 text-neutral-400"
                }  size-10 rounded-full flex items-center justify-center`}
              >
                <ArrowUp size={30} />
              </DrawerTrigger>
            </FormAddMoney>
            <h1 className="text-sm font-medium">{lang.wallet_detail.move}</h1>
          </div>
          <div className="flex flex-col items-center w-max">
            <FormAddMoney typeTransaction="pay" wallet={walletNew ?? null}>
              <DrawerTrigger
                disabled={
                  Number(wallet?.results?.wallet?.balance) <= 0 &&
                  wallet?.results?.wallet?.category !== "debt"
                }
                className={`${
                  Number(wallet?.results?.wallet?.balance) > 0 ||
                  wallet?.results?.wallet?.category === "debt"
                    ? "bg-emerald text-white"
                    : "bg-neutral-200 text-neutral-400"
                }    size-10 rounded-full flex items-center justify-center`}
              >
                <ArrowRight size={30} />
              </DrawerTrigger>
            </FormAddMoney>
            <h1 className="text-sm font-medium">
              {lang.wallet_detail.transfer}
            </h1>
          </div>
        </div>

        <div className="bg-white min-h-[50vh] md:border-x md:border-t md:rounded-t-md p-3">
          <SearchTransaction />
          <WalletTransaction />
        </div>
      </div>
    </WalletContextProvider>
  );
}
