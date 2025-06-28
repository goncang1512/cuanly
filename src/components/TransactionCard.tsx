"use client";
import { deleteTransaction } from "@/actions/transaction.action";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { iconFn, icons } from "@/lib/dynamicIcon";
import { formatTanggal } from "@/lib/time";
import { TransactionType } from "@/lib/types";
import { ArrowLeft, ArrowRight, RefreshCcw, Timer } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import {
  DeleteTransaction,
  EditTransaction,
} from "./WalletPage/params/EditTransaction";

export default function TransactionCard({
  data,
  banyak,
  index,
}: {
  data: TransactionType;
  banyak?: number;
  index: number;
}) {
  const [newIcon, setNewIcon] = useState({
    key: "",
    drawer: false,
  });
  const [dialog, setDialog] = useState(false);
  const [editChange, setEditChange] = useState(false);
  const [onDelete, setOnDelete] = useState(false);
  const { formAction, isPending } = useFormActionState(deleteTransaction, null);

  if (isPending) {
    return null;
  }

  const { Icon, iconData } = iconFn(
    newIcon.key !== "" ? newIcon.key : String(data?.category)
  );
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
                <Drawer
                  open={newIcon.drawer}
                  onOpenChange={(open) =>
                    setNewIcon({ ...newIcon, drawer: open })
                  }
                >
                  <DrawerTrigger
                    disabled={!editChange}
                    className="disabled:cursor-default"
                  >
                    <div
                      style={{ backgroundColor: iconData?.color }}
                      className="p-1 rounded-full w-max"
                    >
                      <Icon size={40} />
                    </div>
                  </DrawerTrigger>
                  <DrawerContent className="h-[60vh]">
                    <ScrollArea className="h-[57vh] py-2">
                      <div className="mx-auto w-full max-w-sm grid grid-cols-3 gap-3 p-2">
                        {icons.map((data, index) => {
                          const { Icon, iconData } = iconFn(data?.key);
                          return (
                            <div
                              onClick={() => {
                                setNewIcon({
                                  ...newIcon,
                                  key: data?.key,
                                  drawer: false,
                                });
                              }}
                              key={index}
                              className="flex items-center justify-center flex-col"
                            >
                              <div
                                style={{ backgroundColor: iconData?.color }}
                                className={`rounded-full p-2 w-max`}
                              >
                                <Icon size={30} />
                              </div>
                              <p className="capitalize">
                                {data?.key?.split("-")[1] ?? data?.key}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </DrawerContent>
                </Drawer>
              </div>
              {editChange ? (
                <EditTransaction
                  setEditChange={setEditChange}
                  setDialog={setDialog}
                  data={data}
                  category={newIcon.key}
                />
              ) : onDelete ? (
                <DeleteTransaction
                  setDialog={setDialog}
                  formAction={formAction}
                  data={data}
                />
              ) : (
                <TableTransaction
                  colorSeparator={colorSeparator}
                  separator={separator}
                  data={data}
                />
              )}
            </div>
            <div className="flex gap-2">
              {!editChange && !onDelete && (
                <>
                  <Button
                    onClick={() => setOnDelete(true)}
                    className="flex-1 justify-center p-1 rounded-md flex items-center gap-2 w-full"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => setEditChange(true)}
                    className="flex-1 justify-center p-1 rounded-md flex items-center gap-2 w-full"
                  >
                    Edit
                  </Button>
                </>
              )}
              {(editChange || onDelete) && (
                <Button
                  type="button"
                  onClick={() => {
                    setEditChange(false);
                    setOnDelete(false);
                  }}
                  className="flex-1 justify-center p-1 rounded-md flex items-center gap-2 w-full"
                >
                  Back
                </Button>
              )}
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
          <TableCell>{formatTanggal(String(data?.createdAt))}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-20 text-neutral-500">Description</TableCell>
          <TableCell className="whitespace-pre-wrap break-words">
            {data?.description}
          </TableCell>
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
  data: TransactionType & { actionType?: string };
  separator: React.ReactNode;
  colorSeparator: string;
}) => {
  const { Icon, iconData } = iconFn(String(data?.category));
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
            <p
              className={`${
                !data.description && "capitalize"
              } text-sm max-md:truncate max-md:w-[20vh] text-start`}
            >
              {data?.description
                ? data?.description
                : String(data?.category).split("-")[1] ?? data.category}
            </p>
            {["new", "edit"].includes(String(data?.actionType)) && (
              <Timer size={14} />
            )}
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
          {formatTanggal(String(data?.createdAt))}
        </p>
      </div>
    </div>
  );
};
