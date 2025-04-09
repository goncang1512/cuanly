import { updateTransaction } from "@/actions/transaction.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WalletContext } from "@/lib/context/WalletContext";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { TransactionType } from "@/lib/types";
import { $Enums } from "@prisma/client";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export function EditTransaction({
  data,
  category,
  setDialog,
  setEditChange,
}: {
  data: TransactionType;
  category: string;
  setDialog: Dispatch<SetStateAction<boolean>>;
  setEditChange: Dispatch<SetStateAction<boolean>>;
}) {
  const { addOptimisticTrans } = useContext(WalletContext);
  const { setFormValue, formValue, formAction, isPending } = useFormActionState(
    updateTransaction,
    {
      type: data?.type || "",
      description: data?.description || "",
      category: data?.category || "",
      amount: "",
      rawAmount: "",
    }
  );
  const handleChange = (jumlah: string) => {
    const numeric = jumlah.replace(/\D/g, "");

    setFormValue({
      ...formValue,
      amount: numeric ? Number(numeric).toLocaleString("id-ID") : "",
      rawAmount: numeric,
    });
  };

  const handleUpdateTransaction = (formData: FormData) => {
    formData.append(
      "category",
      category !== "" ? category : formValue.category
    );
    formData.append("amount", String(formValue.rawAmount));
    formData.append("trans_id", data?.id);

    addOptimisticTrans({
      ...data,
      balance: Number(formValue.rawAmount),
      description: formValue.description,
      type: formValue.type,
      actionType: "edit",
    } as TransactionType & { actionType: string });

    formAction(formData);
  };

  useEffect(() => {
    if (data) {
      handleChange(String(data?.balance));
    }
  }, [data]);

  useEffect(() => {
    if (isPending) {
      setDialog(false);
      setEditChange(false);
    }
  }, [isPending]);

  return (
    <form action={handleUpdateTransaction} className="grid gap-3">
      <div className="w-full grid gap-2">
        <Label>Description</Label>
        <Input
          autoFocus
          value={formValue.description}
          onChange={(e) =>
            setFormValue({ ...formValue, description: e.target.value })
          }
          name="description"
          placeholder="food"
        />
      </div>
      <div className="relative flex-1">
        <Input
          value={formValue.amount}
          onChange={(e) => handleChange(e.target.value)}
          id="jumlah"
          accept="numeric"
          name="jumlah"
          className="pl-8"
          type="text"
          required
          placeholder="Amount transaction"
        />
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400">
          Rp
        </span>
      </div>
      <Select
        name="paymentmethod"
        value={formValue.type}
        onValueChange={(e) =>
          setFormValue({ ...formValue, type: e as $Enums.TransType })
        }
        required
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Payment method" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="add">Add</SelectItem>
            <SelectItem value="move">Move</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
            <SelectItem value="pay">Pay</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="submit" className="bg-emerald hover:bg-dark-emerald">
        Edit transaction
      </Button>
    </form>
  );
}

export const DeleteTransaction = ({
  setDialog,
  formAction,
  data,
}: {
  setDialog: Dispatch<SetStateAction<boolean>>;
  formAction: (formData: FormData) => void;
  data: TransactionType;
}) => {
  const { deleteTransaction: handleDelete } = useContext(WalletContext);
  const [password, setPassword] = useState("");

  return (
    <form
      className="flex-1 flex-col gap-2 flex items-center justify-center"
      action={(formData) => {
        setDialog(false);
        handleDelete(formData, formAction, data?.id);
      }}
    >
      <div className="grid gap-2 w-full">
        <Label htmlFor="delete">
          Input <span className="text-red-500">delete</span> for delete
          transaction
        </Label>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="delete"
          type="text"
          name="password-delete"
          placeholder="delete"
        />
      </div>

      <Button
        disabled={password !== "delete"}
        type="submit"
        className="bg-red-500 hover:bg-red-600 justify-center p-1 rounded-md flex items-center gap-2 w-full "
      >
        Delete
      </Button>
    </form>
  );
};
