import { getWallet } from "@/actions/wallet.action";
import { PieChartMonth } from "@/components/ChartPage/PieChart";
import CardWallet from "@/components/HomePage/CardWallet";
import TopBar from "@/components/HomePage/TopBar";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const data = await getWallet();
  return (
    <div className="p-2">
      <TopBar />
      <div className="pt-14 min-h-screen flex flex-col gap-3">
        <CardWallet
          wallet={data?.results?.wallet}
          transaction={data?.results?.transaction}
        />
        <div className="flex flex-col gap-2">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-xl font-semibold">Planning</h1>
            <Link
              href={`/planning`}
              className="text-medium border-b-2 border-emerald"
            >
              See all
            </Link>
          </div>
          <div className="flex-1 grid md:grid-cols-2 grid-cols-1">
            <Link
              href={`/planning?action=create`}
              className="border rounded-md p-2 flex items-center gap-2"
            >
              <div className="bg-emerald text-white rounded-full p-1 w-max">
                <Plus size={35} />
              </div>
              <p>Create a payment plan</p>
            </Link>
          </div>
        </div>

        <div className="flex md:flex-row flex-col">
          <div className="flex-1 shadow-sm border p-3 flex items-center justify-center rounded-md bg-white">
            <PieChartMonth data={data?.results?.pieChart} />
          </div>
          <div className="flex-1 w-full h-full"></div>
        </div>
      </div>
    </div>
  );
}
