"use client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import React from "react";

export default function MonthChoice({
  data,
  newDate,
}: {
  data: { createdAt: Date }[];
  newDate: Date;
}) {
  const router = useRouter();
  return (
    <div className="py-3 flex gap-3 overflow-x-auto pr-3">
      {(data ?? []).map((item: { createdAt: Date }) => {
        const formatted = format(item.createdAt, "MMMM yyyy", {
          locale: id,
        });
        const queryDate = format(item.createdAt, "yyyy-MM");
        const qeryIn = format(newDate, "yyyy-MM");
        return (
          <button
            onClick={() => router.push(`?date=${queryDate}`)}
            className={`${
              String(qeryIn) === String(queryDate)
                ? "bg-emerald-500 text-white"
                : "bg-neutral-300 text-black"
            }  w-max px-2 py-1 rounded-full text-sm cursor-pointer whitespace-nowrap`}
            key={String(item.createdAt)}
          >
            {String(formatted)}
          </button>
        );
      })}
    </div>
  );
}
