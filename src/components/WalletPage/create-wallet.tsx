"use client";
import { Card } from "@/components/ui/card";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FormCreateWallet, {
  FormWalletContext,
} from "@/components/WalletPage/FormCreateWallet";
import { useTranslation } from "@/language/useLanguage";
import { Plus } from "lucide-react";

export default function CreateWallet() {
  const { lang } = useTranslation();
  return (
    <FormWalletContext>
      <DialogTrigger>
        <Card className="flex h-32 items-center gap-2 justify-center bg-light-emerald border-0">
          <span className="bg-emerald rounded-full size-12 flex items-center justify-center text-neutral-700">
            <Plus size={30} />
          </span>
          <p className="font-medium">{lang.wallet_page.make_wallet}</p>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <FormCreateWallet />
      </DialogContent>
    </FormWalletContext>
  );
}
