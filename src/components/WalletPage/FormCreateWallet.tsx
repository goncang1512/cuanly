"use client";
import { createWallet } from "@/actions/wallet.action";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { $Enums } from "@prisma/client";
import { authClient } from "@/lib/auth-client";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { iconFn, icons } from "@/lib/dynamicIcon";

type WalletTypeValue = {
  name: string;
  category: string;
  type: string;
};

const walletVal = {
  name: "",
  category: "",
  type: "",
};

const WalletContext = createContext(
  {} as { onOpen: boolean; setOnOpen: Dispatch<SetStateAction<boolean>> }
);

export const FormWalletContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [onOpen, setOnOpen] = useState(false);
  return (
    <WalletContext.Provider value={{ onOpen, setOnOpen }}>
      <Dialog open={onOpen} onOpenChange={setOnOpen}>
        {children}
      </Dialog>
    </WalletContext.Provider>
  );
};

export default function FormCreateWallet() {
  const session = authClient.useSession();
  const { setOnOpen } = useContext(WalletContext);
  const { formValue, setFormValue, message, formAction, isPending, state } =
    useFormActionState<WalletTypeValue>(createWallet, walletVal);

  useEffect(() => {
    if (state?.status) {
      setOnOpen(false);
    }
  }, [state]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Make a wallet</DialogTitle>
        <DialogDescription className="text-red-500">
          {message}
        </DialogDescription>
      </DialogHeader>
      <form
        action={(formData) => {
          formData.append("user_id", String(session?.data?.user?.id));
          formAction(formData);
        }}
        className="flex flex-col gap-3"
      >
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            value={formValue.name}
            onChange={(e) =>
              setFormValue({ ...formValue, name: e.target.value })
            }
            type="text"
            id="name"
            name="name"
            placeholder="Dompet utama"
            required
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="kategori">Kategori</Label>
          <Select
            required
            name="kategori"
            value={formValue.category}
            onValueChange={(e) => setFormValue({ ...formValue, category: e })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {icons.map((data, index) => {
                  const { Icon } = iconFn(data?.key);
                  return (
                    <SelectItem
                      className="capitalize"
                      value={data?.key}
                      key={index}
                    >
                      <Icon /> {data?.key.split("-")[1] ?? data?.key}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="type">Jenis</Label>
          <Select
            value={formValue.type}
            onValueChange={(e) =>
              setFormValue({ ...formValue, type: e as $Enums.TypeWallet })
            }
            name="type"
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="self">Self</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button disabled={isPending}>
          {isPending ? (
            <LoaderCircle size={20} className="animate-spin" />
          ) : (
            "Create"
          )}
        </Button>
      </form>
    </>
  );
}
