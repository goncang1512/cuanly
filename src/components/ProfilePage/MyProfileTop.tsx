"use client";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SessionUser } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/language/useLanguage";

export default function TopBar({ user }: { user: SessionUser }) {
  const router = useRouter();
  const { lang } = useTranslation();
  return (
    <div
      className={`h-14 fixed top-0 w-full z-50 left-0 flex justify-center duration-200`}
    >
      <div className="md:w-3xl w-full flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-semibold duration-200">
            {lang.profile_page.profile}
          </h1>
        </div>

        <Link href={`/profile/${user?.id}`} className="flex gap-2">
          <Pencil size={20} className="duration-200" />
        </Link>
      </div>
    </div>
  );
}
