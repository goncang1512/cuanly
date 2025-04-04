import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { X } from "lucide-react";

function DrawerAdd() {
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDrawer(false);
      }
    };

    if (showDrawer) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showDrawer]);

  return (
    <Drawer open={showDrawer} onOpenChange={setShowDrawer}>
      <DrawerTrigger asChild>
        <button className="bg-emerald hover:bg-dark-emerald absolute -top-3 left-1/2 transform -translate-x-1/2 size-12 flex items-center justify-center text-white rounded-full">
          <svg
            className="size-8 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h14m-7 7V5"
            />
          </svg>
        </button>
      </DrawerTrigger>
      <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[100vh] data-[vaul-drawer-direction=bottom]:rounded-none data-[vaul-drawer-direction=bottom]:border-0">
        <div className="mx-auto w-full max-w-sm h-screen">
          <DrawerHeader>
            <button
              onClick={() => setShowDrawer(false)}
              className="absolute right-3 top-2"
            >
              <X />
            </button>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerAdd;
