"use client";
import { useTranslation } from "@/language/useLanguage";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function PlanningSection() {
  const { lang } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-xl font-semibold">{lang.home_page.planning}</h1>
        <Link
          href={`/planning`}
          className="text-medium border-b-2 border-emerald"
        >
          {lang.home_page.see_all}
        </Link>
      </div>
      <div className="flex-1 grid md:grid-cols-2 grid-cols-1">
        <Link
          href={`/planning?action=create`}
          className="border rounded-md p-2 flex items-center gap-2"
        >
          <div className="bg-emerald text-white rounded-full p-1 w-max">
            <Plus size={35} />
          </div>
          <p>{lang.home_page.create_plan}</p>
        </Link>
      </div>
    </div>
  );
}
