"use client";
import {
  canceledLedger,
  deleteLedger,
  paidLedger,
} from "@/actions/ledger.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/language/useLanguage";
import { authClient } from "@/lib/auth-client";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { TLedger } from "@/lib/types";
import { BanknoteArrowDown, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function TableTransactin({ data }: { data: TLedger[] }) {
  const { lang } = useTranslation();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>{lang.group_wallet.piutang}</TableHead>
          <TableHead>{lang.group_wallet.utang}</TableHead>
          <TableHead>{lang.group_wallet.amount}</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => {
          return (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item?.from?.name}</TableCell>
              <TableCell>{item?.to?.name}</TableCell>
              <TableCell>
                {(item.amount ?? 0).toLocaleString("id-ID")}
              </TableCell>
              <TableCell>
                <Badge
                  variant={item.status === "paid" ? "success" : "destructive"}
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DialogPaid item={item} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

const formLedger = {
  displayValue: "",
  rawValue: 0,
};

const DialogPaid = ({ item }: { item: TLedger }) => {
  const params = useParams();
  const { lang } = useTranslation();
  const session = authClient.useSession();
  const [errMsg, setErrMsg] = useState("");
  const [onDialog, setOnDialog] = useState(false);
  const { setFormValue, formValue, formAction, state, isPending } =
    useFormActionState(paidLedger, formLedger);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, "");
    const numeric = raw.replace(/[^0-9]/g, "");
    const value = Number(numeric);

    setFormValue({
      ...formValue,
      displayValue: numeric ? value.toLocaleString("id-ID") : "",
      rawValue: value,
    });
  };

  useEffect(() => {
    setErrMsg("");
    if (state.status) {
      setOnDialog(false);
    } else {
      setErrMsg(state.message);
    }
  }, [state.status, isPending]);

  return (
    <Dialog open={onDialog} onOpenChange={setOnDialog}>
      <DialogTrigger>
        <BanknoteArrowDown />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{lang.group_wallet.paid.paid_utang_title}</DialogTitle>
        <DialogDescription className="text-center text-red-500">
          {errMsg}
        </DialogDescription>
        <div className="flex items-start gap-3">
          <div>
            <div className="flex items-center text-base gap-2">
              <Label className="text-base">
                {lang.group_wallet.paid.utang} :
              </Label>
              <p>Rp {item.amount.toLocaleString("id-ID")}</p>
            </div>
            <div className="flex items-center text-base gap-2">
              <Label className="text-base">
                {lang.group_wallet.paid.paid} :
              </Label>
              <p>
                Rp{" "}
                {item.paidMount > 0
                  ? item.paidMount.toLocaleString("id-ID")
                  : "-"}
              </p>
            </div>
          </div>
          <div className="flex items-center text-base gap-2">
            <Label className="text-base">
              {lang.group_wallet.paid.amount_due} :
            </Label>
            <p>Rp {(item.amount - item.paidMount).toLocaleString("id-ID")}</p>
          </div>
        </div>

        {session?.data?.user?.id === item?.to?.id &&
          item?.status === "unpaid" && (
            <form
              className="grid gap-2"
              action={(formData) => {
                formData.append("wallet_id", String(params?.wallet_id));
                formData.append("paid", String(item.amount - item.paidMount));
                formData.append("paid_mount", String(formValue.rawValue));
                formData.append("ledger_id", item.id);
                formAction(formData);
              }}
            >
              <div className="grid gap-2">
                <Label>{lang.group_wallet.paid.amount}</Label>
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    Rp
                  </span>
                  <Input
                    placeholder="-"
                    value={formValue.displayValue}
                    onChange={handleChange}
                    className="pl-8" // tambahkan padding kiri agar tidak menimpa "Rp"
                  />
                </div>
              </div>

              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  lang.group_wallet.paid.paid
                )}
              </Button>
            </form>
          )}
        {session?.data?.user?.id === item?.from?.id && (
          <div className="flex justify-between items-center">
            <DeleteButton
              item={item}
              setOnDialog={setOnDialog}
              setErrMsg={setErrMsg}
            />
            {item.status === "paid" && (
              <CanceldButton
                item={item}
                setOnDialog={setOnDialog}
                setErrMsg={setErrMsg}
              />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const CanceldButton = ({
  item,
  setOnDialog,
  setErrMsg,
}: {
  item: TLedger;
  setOnDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { lang } = useTranslation();
  const { formAction, isPending, state } = useFormActionState(
    canceledLedger,
    null
  );

  useEffect(() => {
    setErrMsg("");
    if (state.status) {
      setOnDialog(false);
    } else {
      setErrMsg(state.message);
    }
  }, [state.status, isPending]);

  return (
    <form
      className="flex justify-end"
      action={(formData) => {
        formData.append("ledger_id", item.id);
        formData.append("wallet_id", String(item?.walletId));
        formAction(formData);
      }}
    >
      <Button className="bg-red-500 hover:bg-red-400 w-content">
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          lang.group_wallet.paid.cancel
        )}
      </Button>
    </form>
  );
};

const DeleteButton = ({
  item,
  setOnDialog,
  setErrMsg,
}: {
  item: TLedger;
  setOnDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { lang } = useTranslation();
  const { formAction, isPending, state } = useFormActionState(
    deleteLedger,
    null
  );

  useEffect(() => {
    setErrMsg("");
    if (state.status) {
      setOnDialog(false);
    } else {
      setErrMsg(state.message);
    }
  }, [state.status, isPending]);

  return (
    <form
      className="flex justify-end"
      action={(formData) => {
        formData.append("ledger_id", item.id);
        formAction(formData);
      }}
    >
      <Button className="bg-red-500 hover:bg-red-400 w-content">
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          lang.group_wallet.paid.delete
        )}
      </Button>
    </form>
  );
};
