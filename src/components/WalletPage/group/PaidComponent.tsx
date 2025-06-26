"use client";

import { createLedger } from "@/actions/ledger.action";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { Loader2, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface UserProps {
  id: string;
  name: string | null;
}

const formLedger = {
  utang: "",
  displayValue: "",
  rawValue: 0,
};

export default function PaidComponent({ users }: { users: UserProps[] }) {
  const params = useParams();
  const [piutang, setPiutang] = useState("");
  const [arrayPiutang, setArrayPiutang] = useState<
    { id: string; name: string | null }[]
  >([]);
  const [arrayUtang, setArrayUtang] = useState<
    { id: string; name: string | null }[]
  >([]);

  const { formValue, state, setFormValue, formAction, isPending } =
    useFormActionState(createLedger, formLedger);
  const session = authClient.useSession();
  const userId = String(session?.data?.user?.id ?? "");
  const [openItem, setOpenItem] = useState<string | null>(null);

  const [tabs, setTabs] = useState<"piutang" | "utang">("piutang");

  useEffect(() => {
    if (!userId) return;

    if (tabs === "piutang") {
      setPiutang(userId);
    } else {
      setFormValue({ ...formValue, utang: userId });
    }
  }, [tabs, userId]);

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
    if (state.status) {
      setOpenItem("item-2");
      setArrayPiutang([]);
      setArrayUtang([]);
    }
  }, [state.status, isPending]);

  const handleChangePiutang = (value: string) => {
    setPiutang(value);

    const selectedUser = users.find((user) => user.id === value);
    if (!selectedUser) return;

    const alreadyAdded = arrayPiutang.some((u) => u.id === selectedUser.id);
    if (!alreadyAdded) {
      setArrayPiutang([
        ...arrayPiutang,
        { id: selectedUser.id, name: selectedUser.name },
      ]);
    }
  };

  const handleChangeUtang = (value: string) => {
    setFormValue({ ...formValue, utang: value });

    const selectedUser = users.find((user) => user.id === value);
    if (!selectedUser) return;

    const alreadyAdded = arrayPiutang.some((u) => u.id === selectedUser.id);
    if (!alreadyAdded) {
      setArrayUtang([
        ...arrayUtang,
        { id: selectedUser.id, name: selectedUser.name },
      ]);
    }
  };

  const handleCreateLedger = (formData: FormData) => {
    formData.append("amount", String(formValue.rawValue));
    formData.append(
      "piutang",
      tabs === "piutang" ? piutang : JSON.stringify(arrayPiutang)
    );

    formData.append(
      "utang",
      tabs === "utang" ? formValue.utang : JSON.stringify(arrayUtang)
    );
    formData.append("wallet_id", String(params?.wallet_id));
    formData.append("tabs", tabs);
    formAction(formData);
  };

  return (
    <div className="pt-5">
      <Accordion
        value={openItem ?? undefined}
        onValueChange={(value) => setOpenItem(value)}
        type="single"
        collapsible
      >
        <AccordionItem value="item-1">
          <AccordionTrigger
            classIcon="hidden"
            className="h-content whitespace-nowrap w-content hover:no-underline flex-0 bg-green-400 px-3 py-1"
          >
            Add Transaction
          </AccordionTrigger>
          <AccordionContent className="">
            <h1 className="text-center font-medium text-base pb-3">
              Add Transaction
            </h1>

            <Tabs
              value={tabs}
              onValueChange={(val) => {
                setTabs(val as "piutang" | "utang");
                setArrayPiutang([]);
                setArrayUtang([]);
                if (val === "piutang") {
                  setFormValue({ ...formValue, utang: "" });
                } else {
                  setPiutang("");
                }
              }}
            >
              <TabsList className="grid grid-cols-2 w-full gap-2">
                <TabsTrigger
                  value="piutang"
                  className="data-[state=active]:bg-emerald hover:bg-emerald-500 duration-200"
                >
                  Piutang
                </TabsTrigger>
                <TabsTrigger
                  value="utang"
                  className="data-[state=active]:bg-emerald hover:bg-emerald-500 duration-200"
                >
                  Utang
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form action={handleCreateLedger} className="grid gap-2">
              <div className="flex gap-2 pt-5">
                <div className="grid gap-2 w-full">
                  <Label>Piutang</Label>
                  <div className="flex gap-2 items-center">
                    <Select
                      disabled={tabs === "piutang"}
                      value={piutang}
                      onValueChange={handleChangePiutang}
                    >
                      <SelectTrigger className="w-full disabled:opacity-100">
                        <SelectValue placeholder="Choose member" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((data) => {
                          return (
                            <SelectItem value={data.id} key={data.id}>
                              {data.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {arrayPiutang.map((data) => {
                      return (
                        <div
                          key={data.id}
                          className="flex items-center gap-2 border rounded-md p-1"
                        >
                          <p>{data.name}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setPiutang("");
                              setArrayPiutang((prev) =>
                                prev.filter((item) => item.id !== data.id)
                              );
                            }}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-2 w-full">
                  <Label>Utang</Label>
                  <div className="flex items-center gap-2">
                    <Select
                      disabled={tabs === "utang"}
                      value={formValue.utang}
                      onValueChange={handleChangeUtang}
                    >
                      <SelectTrigger className="w-full disabled:opacity-100">
                        <SelectValue placeholder="Choose member" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((data) => (
                          <SelectItem value={`${data.id}`} key={data.id}>
                            {data.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {arrayUtang.map((data) => {
                      return (
                        <div
                          key={data.id}
                          className="flex items-center gap-2 border rounded-md p-1"
                        >
                          <p>{data.name}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setFormValue({ ...formValue, utang: "" });
                              setArrayUtang((prev) =>
                                prev.filter((item) => item.id !== data.id)
                              );
                            }}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <div className="grid gap-2">
                  <Label>Amount</Label>
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
              </div>

              <Button type="submit">
                {isPending ? <Loader2 className="animate-spin" /> : "Send"}
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
