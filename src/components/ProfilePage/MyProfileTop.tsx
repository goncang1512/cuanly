"use client";
import { Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SessionUser } from "@/lib/types";

export default function TopBar({ user }: { user: SessionUser }) {
  return (
    <div
      className={`h-14 fixed top-0 w-full z-50 left-0 flex justify-center duration-200`}
    >
      <div className="md:w-3xl w-full flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold duration-200">My profile</h1>
        </div>

        <Link href={`/profile/@${user?.name}`} className="flex gap-2">
          <Pencil size={20} className="duration-200" />
        </Link>
      </div>
    </div>
  );
}
