import { checkMember } from "@/actions/member.action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function LayoutGroup({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ wallet_id: string }>;
}) {
  const getParams = await params;
  const member = await checkMember(getParams?.wallet_id);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!member.results?.includes(String(session?.user?.id))) {
    return redirect("/wallet");
  }

  return <>{children}</>;
}
