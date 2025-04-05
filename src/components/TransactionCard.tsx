import { iconFn } from "@/lib/dynamicIcon";
import { formatDate } from "@/lib/time";
import { TransactionType } from "@/lib/types";
import { RefreshCcw } from "lucide-react";
import React from "react";

export default function TransactionCard({
  data,
  banyak,
  index,
}: {
  data: TransactionType;
  banyak?: number;
  index: number;
}) {
  return (
    <div
      className={`${
        index + 1 === banyak ? "" : "border-b"
      } px-3 py-2 flex items-center justify-between border-neutral-300`}
    >
      <TransactionShow data={data} />
    </div>
  );
}

export const TransactionShow = ({ data }: { data: TransactionType }) => {
  const { Icon, iconData } = iconFn(data?.category);

  const separator =
    data?.type === "add" ? (
      "+"
    ) : ["transfer", "pay"].includes(data?.type) ? (
      "-"
    ) : (
      <RefreshCcw size={13} />
    );

  return (
    <>
      <div className="flex items-center gap-3">
        <Icon
          style={{ backgroundColor: iconData?.color }}
          className="p-1 rounded-md"
          size={30}
        />
        <div>
          <p className="text-sm capitalize">
            {data?.description !== ""
              ? data?.description
              : data?.category.split("-")[1]}
          </p>
          <span className="font-semibold flex items-center gap-1">
            {separator} Rp
            {data?.balance.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
      <p className="text-sm">{formatDate(String(data?.createdAt))}</p>
    </>
  );
};
