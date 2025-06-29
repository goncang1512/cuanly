import { getWalletPage } from "@/actions/wallet.action";
import { Tabs, TabsList } from "@/components/ui/tabs";
import AssetShow from "@/components/WalletPage/AssetShow";
import CardWallet from "@/components/WalletPage/CardWallet";
import CreateWallet from "@/components/WalletPage/create-wallet";
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
        <CreateWallet />
      </div>
    </div>
  );
}

export default WalletPage;
