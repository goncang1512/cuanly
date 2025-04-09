import { getWallet } from "@/actions/wallet.action";
import { PieChartMonth } from "@/components/ChartPage/PieChart";
import CardWallet from "@/components/HomePage/CardWallet";
import TopBar from "@/components/HomePage/TopBar";

export default async function Home() {
  const data = await getWallet();
  return (
    <div className="p-2">
      <TopBar />
      <div className="pt-14 min-h-screen">
        <CardWallet
          wallet={data?.results?.wallet}
          transaction={data?.results?.transaction}
        />
        <div className="grid md:grid-cols-3 grid-cols-2 p-2 ">
          <div className="flex-1 shadow-sm border p-3 flex items-center justify-center rounded-md bg-white">
            <PieChartMonth data={data?.results?.pieChart} />
          </div>
        </div>
      </div>
    </div>
  );
}
