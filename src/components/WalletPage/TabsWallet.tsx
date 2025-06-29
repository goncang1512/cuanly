"use client";
import React from "react";
import { TabsTrigger } from "../ui/tabs";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/language/useLanguage";

export default function TabsWallet() {
  const router = useRouter();
  const { lang } = useTranslation();
  return (
    <>
      <TabsTrigger
        onClick={() => router.push("/wallet?type=all")}
        value="all"
        className="rounded-full data-[state=active]:bg-neutral-200"
      >
        {lang.wallet_page.tabs.all}
      </TabsTrigger>
      <TabsTrigger
        onClick={() => router.push("/wallet?type=self")}
        value="self"
        className="rounded-full data-[state=active]:bg-neutral-200"
      >
        {lang.wallet_page.tabs.self}
      </TabsTrigger>
      <TabsTrigger
        onClick={() => router.push("/wallet?type=group")}
        value="group"
        className="rounded-full data-[state=active]:bg-neutral-200"
      >
        {lang.wallet_page.tabs.group}
      </TabsTrigger>
    </>
  );
}
