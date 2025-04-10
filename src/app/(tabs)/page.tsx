import { getWallet } from "@/actions/wallet.action";
import { PieChartMonth } from "@/components/ChartPage/PieChart";
import CardWallet from "@/components/HomePage/CardWallet";
import TopBar from "@/components/HomePage/TopBar";

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
        <div className="flex">
          <div className="flex-1 shadow-sm border p-3 flex items-center justify-center rounded-md bg-white">
            <PieChartMonth data={data?.results?.pieChart} />
          </div>
          <div className="flex-1 w-full h-full"></div>
        </div>
      </div>
    </div>
  );
}
