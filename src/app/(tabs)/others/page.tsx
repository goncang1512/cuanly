"use client";
import TopBar from "@/components/TopBar";
import { authClient } from "@/lib/auth-client";
import { getSrc } from "@/lib/utils/getSrc";
import { ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function OtherPage() {
  const router = useRouter();
  const session = authClient.useSession();
  const user = session?.data?.user;

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth?form=sign-in");
        },
      },
    });
  };

  const src = getSrc({
    avatar: user?.avatar || "",
    avatarId: user?.avatarId || "",
    image: user?.image || "",
  });

  return (
    <div className="md:px-0 px-3 md:pt-5 pt-4">
      <TopBar title="Others" iconName="Settings" />
      <div className="flex justify-between items-center pt-8">
        <div className="flex items-center gap-3">
          {src ? (
            <img
              src={`${src}`}
              alt=""
              className="size-16 border rounded-full"
            />
          ) : (
            <div className="size-16 border rounded-full bg-neutral-200" />
          )}
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
        <button onClick={logout} className="flex gap-3 items-center w-full">
          <LogOut />
          <p className="text-start border-b w-full pb-2">Logout</p>
        </button>
      </div>

      <div className="h-[300vh]"></div>
    </div>
  );
}
