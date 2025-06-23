"use client";
import { getOneWallet } from "@/actions/wallet/profile.action";
import ProfileTopBar from "@/components/ProfilePage/MyProfileTop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { SessionUser } from "@/lib/types";
import { Check, Files } from "lucide-react";
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";

export default function EditProfile() {
  const dataSession = authClient.useSession();
  const user = dataSession?.data?.user as SessionUser;
  const [state, formAction, isPending] = useActionState(getOneWallet, null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;

    const formData = new FormData();
    formData.append("user_id", user?.id);
    startTransition(() => {
      formAction(formData);
    });
  }, [user]);

  const handleCopy = (wallet_id: string) => {
    if (!wallet_id) return;
    navigator.clipboard.writeText(wallet_id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Reset setelah 1.5 detik
    });
  };

  return (
    <div className="flex flex-col gap-5 justify-center items-center py-5 md:px-0 px-4">
      <div>
        <ProfileTopBar user={user} />
      </div>

      <div className="flex flex-col justify-center items-center">
        <Avatar className="size-32">
          <AvatarImage
            className="object-cover"
            src={`${user?.avatar ?? user?.image}`}
          />
          <AvatarFallback>
            <img
              src={`/avatar.jpeg`}
              alt=""
              className="border rounded-full object-cover"
            />
          </AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold">{user?.name}</h1>
        <p className="text-sm text-neutral-400">{user?.email}</p>
        <p className="text-sm text-neutral-400">{user?.phonenumber}</p>
      </div>

      {isPending ? (
        <Skeleton className="bg-green-500 rounded-md md:w-md w-full flex justify-between h-32" />
      ) : (
        <div className="bg-green-600 text-white p-4 rounded-md md:w-md w-full flex flex-col">
          <div className="flex justify-between w-full">
            <span>Main Wallet Number</span>{" "}
            <div className="flex items-center gap-2">
              <p className="font-semibold">
                {state?.results?.id.match(/.{1,4}/g)?.join(" ")}
              </p>
              <button
                disabled={copied}
                onClick={() => handleCopy(String(state?.results?.id))}
              >
                {copied ? <Check size={20} /> : <Files size={20} />}
              </button>
            </div>
          </div>
          <div className="flex justify-between w-full">
            <span>Balance</span>
            <span>Rp{state?.results?.balance.toLocaleString("id-ID")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
