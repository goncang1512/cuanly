import BottomNav from "@/components/BottomNav";
import { auth } from "@/lib/auth";
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
    <div className="flex justify-center">
      <div className="min-h-screen md:w-3xl w-full ">{children}</div>
      <BottomNav />
    </div>
  );
}

export default layout;
