import { getWallet } from "@/actions/wallet.action";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetShow from "@/components/WalletPage/AssetShow";
import CardWallet from "@/components/WalletPage/CardWallet";
import { Plus } from "lucide-react";

async function WalletPage() {
  const data = await getWallet();
  const wallet = data?.results;

  return (
    <div className="p-3 flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">Wallet</h1>
      <Tabs defaultValue="mypocket" className="w-full">
        <TabsList className="grid w-full grid-cols-[1fr_1fr_1fr_0.1fr] bg-transparent gap-3">
          <TabsTrigger
            value="all"
            className="rounded-full data-[state=active]:bg-neutral-200"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="mypocket"
            className="rounded-full data-[state=active]:bg-neutral-200"
          >
            My pocket
          </TabsTrigger>
          <TabsTrigger
            value="shared"
            className="rounded-full data-[state=active]:bg-neutral-200"
          >
            Shared pocket
          </TabsTrigger>
          <button className="flex items-center justify-center h-full px-1">
            <Plus />
          </button>
        </TabsList>
      </Tabs>
      <AssetShow wallet={wallet} />
      <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
        <CardWallet wallet={wallet} />
        <Dialog>
          <DialogTrigger>
            <Card className="flex items-center gap-2 justify-center bg-light-emerald border-0">
              <span className="bg-emerald rounded-full size-12 flex items-center justify-center text-neutral-700">
                <Plus size={30} />
              </span>
              <p className="font-medium">Make a wallet</p>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Make a wallet</DialogTitle>
              <DialogDescription>message</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default WalletPage;
