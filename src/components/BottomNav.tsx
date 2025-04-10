"use client";
import React from "react";
import LinkNav from "./Navigation/LinkNav";
import DrawerAdd from "./Navigation/DrawerAdd";
import { usePathname } from "next/navigation";
import NavContextProvider from "@/lib/context/NavContext";
import { Ellipsis } from "lucide-react";

function BottomNav() {
  const pathname = usePathname();
  return (
    <NavContextProvider>
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="grid h-full max-w-xl grid-cols-5 mx-auto font-medium">
          <LinkNav
            inHref={pathname === "/"}
            href="/"
            icon={
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
            }
          >
            Home
          </LinkNav>
          <LinkNav
            inHref={pathname === "/wallet"}
            icon={
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z" />
                <path d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z" />
              </svg>
            }
            href="/wallet?type=self"
          >
            Wallet
          </LinkNav>
          <CircleAdd>
            <DrawerAdd />
          </CircleAdd>
          <LinkNav
            inHref={pathname === "/charts"}
            icon={
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13.5 2c-.178 0-.356.013-.492.022l-.074.005a1 1 0 0 0-.934.998V11a1 1 0 0 0 1 1h7.975a1 1 0 0 0 .998-.934l.005-.074A7.04 7.04 0 0 0 22 10.5 8.5 8.5 0 0 0 13.5 2Z" />
                <path d="M11 6.025a1 1 0 0 0-1.065-.998 8.5 8.5 0 1 0 9.038 9.039A1 1 0 0 0 17.975 13H11V6.025Z" />
              </svg>
            }
            href="/charts"
          >
            Charts
          </LinkNav>
          <LinkNav
            inHref={pathname === "/others"}
            icon={<Ellipsis size={28} />}
            href="/others"
          >
            Others
          </LinkNav>
        </div>
      </div>
    </NavContextProvider>
  );
}

const CircleAdd = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="inline-flex flex-col items-center justify-center group relative">
      <div className="p-[0.5] rounded-full absolute z-10 -top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white w-16 left-1/2 transform -translate-x-1/2 top-4 h-12 absolute z-20">
          {children}
        </div>
        <div className="bg-white border p-1 rounded-full absolute left-1/2 transform -translate-x-1/2">
          <button className="bg-white size-12 flex items-center justify-center  rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
