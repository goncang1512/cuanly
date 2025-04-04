import { getWallet } from "@/actions/wallet.action";
import CardWallet from "@/components/HomePage/CardWallet";
import TopBar from "@/components/HomePage/TopBar";

export default async function Home() {
  const data = await getWallet();

  return (
    <div className="p-2">
      <TopBar />
      <div className="pt-14 h-[300vh]">
        <CardWallet wallet={data?.results} />
      </div>
    </div>
  );
}
