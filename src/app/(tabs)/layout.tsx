import BottomNav from "@/components/BottomNav";
import { auth } from "@/lib/auth";
import GlobalContextProvider from "@/lib/context/GlobalContext";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

async function layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/auth?form=sign-in");
  }

  return (
    <GlobalContextProvider>
      <div className="flex justify-center">
        <div className="min-h-screen md:w-3xl w-full pb-16">{children}</div>
        <BottomNav />
      </div>
    </GlobalContextProvider>
  );
}

export default layout;
