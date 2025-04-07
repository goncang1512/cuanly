"use client";
import { deleteTransaction } from "@/actions/transaction.action";
import { WalletContext } from "@/lib/context/WalletContext";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { iconFn } from "@/lib/dynamicIcon";
import { formatDate } from "@/lib/time";
import { TransactionType } from "@/lib/types";
import { ArrowLeft, ArrowRight, RefreshCcw, Timer, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext } from "react";

export default function TransactionCard({
  data,
  banyak,
  index,
}: {
  data: TransactionType;
  banyak?: number;
  index: number;
}) {
  const { deleteTransaction: handleDelete } = useContext(WalletContext);
  const { formAction, isPending } = useFormActionState(deleteTransaction, null);

  if (isPending) {
    return null;
  }

  return (
    <div
      className={`${index + 1 === banyak ? "" : "border-b"} ${
        data.status === "delete" && "hidden"
      } px-3 py-2 flex items-center border-neutral-300 `}
    >
      <div className="flex items-center gap-2 w-full">
        <TransactionShow data={data} />
        <form
          action={(formData) => {
            handleDelete(formData, formAction, data?.id);
          }}
        >
          <button type="submit" className="hover:bg-neutral-300 p-1 rounded-md">
            <Trash2 />
          </button>
        </form>
      </div>
    </div>
  );
}

export const TransactionShow = ({ data }: { data: TransactionType }) => {
  const { Icon, iconData } = iconFn(data?.category);
  const params = useParams();

  const separator =
    data?.type === "add" ? (
      "+"
    ) : ["transfer", "pay"].includes(data?.type) ? (
      "-"
    ) : (
      <RefreshCcw size={13} />
    );

  const colorSeparator =
    data?.type === "add"
      ? "text-emerald-600"
      : ["transfer", "pay"].includes(data?.type)
      ? "text-red-500"
      : "text-neutral-900";

  return (
    <div className="flex justify-between  w-full">
      <div className="flex items-center gap-3">
        <Icon
          style={{ backgroundColor: iconData?.color }}
          className="p-1 rounded-md"
          size={30}
        />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm capitalize truncate max-md:w-[60%]">
              {data?.description !== ""
                ? data?.description
                : data?.category.split("-")[1]}
            </p>
            {data?.userId === "goncang" && <Timer size={14} />}
          </div>
          <span
            className={`${colorSeparator} font-semibold flex items-center gap-1`}
          >
            {separator} Rp
            {data?.balance.toLocaleString("id-ID")}
          </span>
          {data?.type === "move" &&
            data?.userId !== "goncang" &&
            (data?.fromId === params?.wallet_id ? (
              <p className="text-xs flex items-center gap-2">
                {data?.fromWallet?.name} <ArrowRight size={13} />{" "}
                {data?.wallet?.name}
              </p>
            ) : (
              <p className="text-xs flex items-center gap-2">
                {data?.wallet?.name} <ArrowLeft size={13} />{" "}
                {data?.fromWallet?.name}
              </p>
            ))}
        </div>
      </div>
      <div className="flex items-center">
        <p className="text-sm text-end">
          {formatDate(String(data?.createdAt))}
        </p>
      </div>
    </div>
  );
};
