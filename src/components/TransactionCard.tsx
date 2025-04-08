"use client";
import { deleteTransaction } from "@/actions/transaction.action";
import { WalletContext } from "@/lib/context/WalletContext";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { iconFn } from "@/lib/dynamicIcon";
import { formatDate } from "@/lib/time";
import { TransactionType } from "@/lib/types";
import { ArrowLeft, ArrowRight, RefreshCcw, Timer } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

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
  const [dialog, setDialog] = useState(false);
  const [editChange, setEditChange] = useState(false);
  const { formAction, isPending } = useFormActionState(deleteTransaction, null);

  if (isPending) {
    return null;
  }

  const { Icon, iconData } = iconFn(data?.category);
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
    <div
      className={`${index + 1 === banyak ? "" : "border-b"} ${
        data.status === "delete" && "hidden"
      } flex items-center border-neutral-300 `}
    >
      <div className="flex items-center gap-2 w-full">
        <Dialog
          onOpenChange={(open) => {
            if (!open) {
              setEditChange(false);
            }
            setDialog(open);
          }}
          open={dialog}
        >
          <DialogTrigger className="w-full cursor-pointer">
            <TransactionShow
              data={data}
              separator={separator}
              colorSeparator={colorSeparator}
            />
          </DialogTrigger>
          <DialogContent className="flex flex-col  justify-between h-[60vh]">
            <DialogHeader>
              <DialogTitle>Manage Transaction</DialogTitle>
            </DialogHeader>
            <div className="h-full w-full">
              <div className="p-4">
                <div
                  style={{ backgroundColor: iconData?.color }}
                  className="p-1 rounded-full w-max"
                >
                  <Icon size={40} />
                </div>
              </div>
              {editChange ? (
                <form>
                  <div className="w-full grid gap-2">
                    <Label>Description</Label>
                    <Input name="description" placeholder="food" />
                  </div>
                </form>
              ) : (
                <TableTransaction
                  colorSeparator={colorSeparator}
                  separator={separator}
                  data={data}
                />
              )}
            </div>
            <div className="flex gap-2">
              {!editChange && (
                <form
                  className="flex-1 flex items-center justify-center"
                  action={(formData) => {
                    setDialog(false);
                    handleDelete(formData, formAction, data?.id);
                  }}
                >
                  <Button
                    type="submit"
                    className=" justify-center p-1 rounded-md flex items-center gap-2 w-full "
                  >
                    Delete
                  </Button>
                </form>
              )}
              <Button
                type="button"
                onClick={() => setEditChange(!editChange)}
                className="flex-1   justify-center p-1 rounded-md flex items-center gap-2 w-full"
              >
                {editChange ? "Back" : "Edit"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

const TableTransaction = ({
  data,
  separator,
  colorSeparator,
}: {
  data: TransactionType;
  separator: React.ReactNode;
  colorSeparator: string;
}) => {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="w-20 text-neutral-500">Jenis</TableCell>
          <TableCell className="capitalize">{data?.type}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-20 text-neutral-500">Wallet</TableCell>
          <TableCell>{data?.wallet?.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-20 text-neutral-500">Amount</TableCell>
          <TableCell className={`${colorSeparator} flex items-center gap-1`}>
            {separator}Rp{data?.balance.toLocaleString("id-ID")}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-20 text-neutral-500">Date</TableCell>
          <TableCell>{formatDate(String(data?.createdAt))}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-20 text-neutral-500">Description</TableCell>
          <TableCell>{data?.description}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export const TransactionShow = ({
  data,
  separator,
  colorSeparator,
}: {
  data: TransactionType;
  separator: React.ReactNode;
  colorSeparator: string;
}) => {
  const { Icon, iconData } = iconFn(data?.category);
  const params = useParams();

  return (
    <div className="flex justify-between  w-full  px-3 py-2">
      <div className="flex items-center gap-3 flex-1">
        <Icon
          style={{ backgroundColor: iconData?.color }}
          className="p-1 rounded-md"
          size={30}
        />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm capitalize truncate">
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
          {data?.type === "adjust" && !params?.wallet_id && (
            <p className="text-xs">{data?.wallet?.name}</p>
          )}
          {data?.type === "move" &&
            (data?.fromId === params?.wallet_id ? (
              <p className="text-xs flex justify-start items-center gap-1">
                {data?.fromWallet?.name} <ArrowRight size={13} />{" "}
                {data?.wallet?.name}
              </p>
            ) : (
              <p className="text-xs flex justify-start items-center gap-1">
                {data?.wallet?.name} <ArrowLeft size={13} />{" "}
                {data?.fromWallet?.name}
              </p>
            ))}
        </div>
      </div>
      <div className="flex items-center justify-end flex-none w-[27%]">
        <p className="text-sm text-end">
          {formatDate(String(data?.createdAt))}
        </p>
      </div>
    </div>
  );
};
