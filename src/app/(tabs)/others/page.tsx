"use client";
import TopBar from "@/components/TopBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { ChevronRight, Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function OtherPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = authClient.useSession();
  const user = session?.data?.user;

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth?form=sign-in");
        },
        onRequest: () => {
          setLoading(true);
        },
        onError: () => {
          setLoading(false);
        },
      },
    });
  };

  return (
    <div className="md:px-2 px-3 md:pt-5 pt-4 min-h-[110vh]">
      <TopBar title="Others" iconName="Settings" />
      <div className="flex justify-between items-center pt-8">
        <div className="flex items-center gap-3">
          <Avatar className="size-16">
            <AvatarImage
              className="object-cover border"
              src={`${user?.avatar ?? user?.image}`}
            />
            <AvatarFallback>
              <img src={`avatar.jpeg`} alt="" className="border rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xl">{user?.name}</h1>
            <p className="text-sm text-neutral-400">{user?.email}</p>
          </div>
        </div>
        <Link href={`/profile`}>
          <ChevronRight />
        </Link>
      </div>

      {/* OTHER */}
      <div className="pt-5">
        <button
          onClick={logout}
          className="flex pb-2 gap-3 items-center w-full border-b"
        >
          {loading ? <Loader2 className="animate-spin" /> : <LogOut />}
          <p className="text-start w-full">Logout</p>
        </button>
      </div>
    </div>
  );
}
