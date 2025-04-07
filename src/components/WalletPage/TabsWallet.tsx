"use client";
import React from "react";
import { TabsTrigger } from "../ui/tabs";
import { useRouter } from "next/navigation";

export default function TabsWallet() {
  const router = useRouter();
  return (
    <>
      <TabsTrigger
        onClick={() => router.push("/wallet?type=all")}
        value="all"
        className="rounded-full data-[state=active]:bg-neutral-200"
      >
        All
      </TabsTrigger>
      <TabsTrigger
        onClick={() => router.push("/wallet?type=self")}
        value="self"
        className="rounded-full data-[state=active]:bg-neutral-200"
      >
        My wallet
      </TabsTrigger>
      <TabsTrigger
        onClick={() => router.push("/wallet?type=group")}
        value="group"
        className="rounded-full data-[state=active]:bg-neutral-200"
      >
        Shared wallet
      </TabsTrigger>
    </>
  );
}
