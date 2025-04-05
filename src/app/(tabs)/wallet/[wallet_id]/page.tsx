import { detailWallet } from "@/actions/wallet.action";
import { Input } from "@/components/ui/input";
import BarTop from "@/components/WalletPage/params/BarTop";
import FormAddMoney from "@/components/WalletPage/params/FormAddMoney";
import { TopDetail } from "@/components/WalletPage/params/TopDetail";
import { TransactionType } from "@/lib/types";
import { ArrowRight, ArrowUp, ListFilter, Search } from "lucide-react";
import React from "react";
import TransactionCard from "@/components/TransactionCard";

export default async function WalletDetail({
  params,
}: {
  params: Promise<{ wallet_id: string }>;
}) {
  const { wallet_id } = await params;
  const wallet = await detailWallet(wallet_id);

  return (
    <div>
      <BarTop />
      <div className="pt-14 min-h-[200vh] flex flex-col gap-3">
        <TopDetail wallet={wallet?.results} />

        <div className="flex justify-center gap-3">
          <div className="flex flex-col items-center w-max">
            <FormAddMoney wallet={wallet?.results} />

            <h1 className="text-sm font-medium">Add money</h1>
          </div>
          <div className="flex flex-col items-center w-max">
            <button className="bg-neutral-200 text-neutral-400 size-10 rounded-full flex items-center justify-center">
              <ArrowUp size={30} />
            </button>
            <h1 className="text-sm font-medium">Move money</h1>
          </div>
          <div className="flex flex-col items-center w-max">
            <button className="bg-neutral-200 text-neutral-400 size-10 rounded-full flex items-center justify-center">
              <ArrowRight size={30} />
            </button>
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
          <div>
            {wallet?.results?.transaction.map(
              (data: TransactionType, index: number) => {
                return (
                  <TransactionCard
                    data={data}
                    index={index}
                    key={data?.id}
                    banyak={wallet?.results?.transaction?.length}
                  />
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
