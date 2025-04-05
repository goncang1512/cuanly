import { detailWallet } from "@/actions/wallet.action";
import { Input } from "@/components/ui/input";
import BarTop from "@/components/WalletPage/params/BarTop";
import { TopDetail } from "@/components/WalletPage/params/TopDetail";
import {
  ArrowRight,
  ArrowUp,
  ListFilter,
  Plus,
  Search,
  ShirtIcon,
} from "lucide-react";
import React from "react";

export default async function WalletDetail({
  params,
}: {
  params: Promise<{ wallet_id: string }>;
}) {
  const { wallet_id } = await params;
  const wallet = await detailWallet(wallet_id);
  const banyak = 10;

  return (
    <div>
      <BarTop />
      <div className="pt-14 min-h-[200vh] flex flex-col gap-3">
        <TopDetail wallet={wallet?.results} />

        <div className="flex justify-center gap-3">
          <div className="flex flex-col items-center w-max">
            <button className="bg-emerald text-white size-10 rounded-full flex items-center justify-center">
              <Plus size={30} />
            </button>
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
            {Array.from({ length: banyak }).map((_, index) => (
              <div
                key={index + 1}
                className={`${
                  index + 1 === banyak ? "" : "border-b"
                } px-3 py-2 flex items-center justify-between border-neutral-300`}
              >
                <div className="flex items-center gap-3">
                  <ShirtIcon className="bg-rose-300 p-1 rounded-md" size={30} />
                  <div>
                    <p className="text-sm">Fashion</p>
                    <span className="font-semibold">Rp{index + 1}00.000</span>
                  </div>
                </div>
                <p>15 Maret 2024</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
