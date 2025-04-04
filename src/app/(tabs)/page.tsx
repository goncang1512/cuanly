import CardWallet from "@/components/HomePage/CardWallet";
import TopBar from "@/components/HomePage/TopBar";

export default function Home() {
  return (
    <div className="p-2">
      <TopBar />
      <div className="pt-14 h-[300vh]">
        <CardWallet />
      </div>
    </div>
  );
}
