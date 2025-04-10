import { detailWallet } from "@/actions/wallet.action";
import { Input } from "@/components/ui/input";
import BarTop from "@/components/WalletPage/params/BarTop";
import FormAddMoney from "@/components/WalletPage/params/FormAddMoney";
import { TopDetail } from "@/components/WalletPage/params/TopDetail";
import { ArrowRight, ArrowUp, ListFilter, Plus, Search } from "lucide-react";
import React from "react";
import { DrawerTrigger } from "@/components/ui/drawer";
import WalletContextProvider from "@/lib/context/WalletContext";
import WalletTransaction from "@/components/WalletPage/params/WalletTransaction";

export default async function WalletDetail({
  params,
}: {
  params: Promise<{ wallet_id: string }>;
}) {
  const { wallet_id } = await params;
  const wallet = await detailWallet(wallet_id);
  const walletNew = wallet?.results?.wallet;
  const countWallet = wallet?.results?.countWallet;

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

            <h1 className="text-sm font-medium">Add money</h1>
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
            <h1 className="text-sm font-medium">Move money</h1>
          </div>
          <div className="flex flex-col items-center w-max">
            <FormAddMoney typeTransaction="pay" wallet={walletNew ?? null}>
              <DrawerTrigger
                disabled={
                  Number(wallet?.results?.wallet?.balance) <= 0 &&
                  wallet?.results?.wallet?.category !== "receivable"
                }
                className={`${
                  Number(wallet?.results?.wallet?.balance) > 0 ||
                  wallet?.results?.wallet?.category === "receivable"
                    ? "bg-emerald text-white"
                    : "bg-neutral-200 text-neutral-400"
                }    size-10 rounded-full flex items-center justify-center`}
              >
                <ArrowRight size={30} />
              </DrawerTrigger>
            </FormAddMoney>
            <h1 className="text-sm font-medium">Transfer & Pay</h1>
          </div>
        </div>

        <div className="bg-white min-h-[50vh] md:border md:rounded-md p-3">
          <form className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400"
              />
              <Input
                className="bg-neutral-100 pl-8"
                placeholder="Search transaction"
              />
            </div>
            <button
              type="button"
              className="flex-none px-2 flex items-center justify-center"
            >
              <ListFilter size={20} />
            </button>
          </form>
          <WalletTransaction />
        </div>
      </div>
    </WalletContextProvider>
  );
}
