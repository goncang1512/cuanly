import { getWalletPage } from "@/actions/wallet.action";
import { Card } from "@/components/ui/card";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList } from "@/components/ui/tabs";
import AssetShow from "@/components/WalletPage/AssetShow";
import CardWallet from "@/components/WalletPage/CardWallet";
import FormCreateWallet, {
  FormWalletContext,
} from "@/components/WalletPage/FormCreateWallet";
import NavbarWallet from "@/components/WalletPage/navbar-wallet";
import TabsWallet from "@/components/WalletPage/TabsWallet";
import { auth } from "@/lib/auth";
import { WalletType } from "@/lib/types";
import { $Enums } from "@prisma/client";
import { Plus } from "lucide-react";
import { headers } from "next/headers";

async function WalletPage(props: {
  searchParams?: Promise<{
    type?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.type || "";

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const allWallet = await getWalletPage(
    String(session?.user?.id),
    query as $Enums.TypeWallet
  );

  return (
    <div className="py-3 md:px-2 px-3 flex flex-col gap-3 min-h-[110vh]">
      <NavbarWallet />
      <Tabs defaultValue={query ?? "self"} className="w-full pt-12">
        <TabsList className="grid w-full grid-cols-3 bg-transparent gap-3">
          <TabsWallet />
          <button className="hidden items-center justify-center h-full px-1">
            <Plus />
          </button>
        </TabsList>
      </Tabs>
      <AssetShow
        query={query}
        wallet={(allWallet?.results as WalletType[]) ?? []}
      />
      <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
        {(allWallet?.results as WalletType[]).map((data: WalletType) => {
          return <CardWallet key={data?.id} wallet={data} />;
        })}
        <FormWalletContext>
          <DialogTrigger>
            <Card className="flex h-32 items-center gap-2 justify-center bg-light-emerald border-0">
              <span className="bg-emerald rounded-full size-12 flex items-center justify-center text-neutral-700">
                <Plus size={30} />
              </span>
              <p className="font-medium">Make a wallet</p>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <FormCreateWallet />
          </DialogContent>
        </FormWalletContext>
      </div>
    </div>
  );
}

export default WalletPage;
