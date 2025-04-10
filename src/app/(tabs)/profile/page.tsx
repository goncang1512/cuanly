"use client";
import TopBar from "@/components/ProfilePage/TopBar";
import { authClient } from "@/lib/auth-client";
import { ChevronRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function ProfilePage() {
  const router = useRouter();
  const session = authClient.useSession();
  const user = session?.data?.user;

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth?form=sign-in"); // redirect to login page
        },
      },
    });
  };

  return (
    <div className="md:px-0 px-3 md:pt-5 pt-4">
      <TopBar />
      <div className="flex justify-between items-center pt-8">
        <div className="flex items-center gap-3">
          <img
            src={String(
              user?.image ??
                "https://i.pinimg.com/736x/03/eb/d6/03ebd625cc0b9d636256ecc44c0ea324.jpg"
            )}
            className="size-16 border rounded-full"
            alt=""
          />
          <div>
            <h1 className="font-semibold text-xl">{user?.name}</h1>
            <p className="text-sm text-neutral-400">{user?.email}</p>
          </div>
        </div>
        <div>
          <ChevronRight />
        </div>
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
