import Link from "next/link";
import React from "react";

function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        <LinkNav
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
          href="/wallet"
        >
          Wallet
        </LinkNav>
        <CircleAdd>
          <button
            type="button"
            className="bg-blue-600 absolute -top-3 left-1/2 transform -translate-x-1/2 size-12 flex items-center justify-center text-white rounded-full"
          >
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
        </CircleAdd>
        <LinkNav
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
          href="/grafik"
        >
          Grafik
        </LinkNav>
        <LinkNav
          icon={
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
          }
          href="/profile"
        >
          Profile
        </LinkNav>
      </div>
    </div>
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
          <button
            type="button"
            className="bg-white size-12 flex items-center justify-center  rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

const LinkNav = ({
  children,
  href,
  icon,
}: {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group"
    >
      <span className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
        {icon}
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
        {children}
      </span>
    </Link>
  );
};

export default BottomNav;
