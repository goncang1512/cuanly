"use client";
import { DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ArrowLeft, Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function BarTop() {
  const router = useRouter();
  return (
    <div className="bg-neutral-50 fixed top-0 left-0 w-full h-14 py-2 px-3 flex items-center justify-center">
      <div className="md:w-3xl w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()}>
            <ArrowLeft />
          </button>
          <h1 className="text-sm font-medium">Wallet details</h1>
        </div>
        <Drawer>
          <DrawerTrigger>
            <Ellipsis />
          </DrawerTrigger>
          <DrawerContent className="h-[50vh]">
            <DialogTitle hidden>Wallet context</DialogTitle>
            <div className="mx-auto w-full max-w-sm mt-2">
              <button className="px-2 py-3 hover:bg-neutral-200 w-full text-start">
                Delete wallet
              </button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
