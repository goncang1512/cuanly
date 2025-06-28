"use client";
import { Input } from "@/components/ui/input";
import { WalletContext } from "@/lib/context/WalletContext";
import { ListFilter, Search } from "lucide-react";
import React, { useContext } from "react";

export default function SearchTransaction() {
  const { optimisticTrans, setFilteredTrans } = useContext(WalletContext);

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const search = (formData.get("search") as string)?.toLowerCase() ?? "";

    const data = optimisticTrans?.filter((data) => {
      const desc = data?.description?.toLowerCase() || "";
      const cat = data?.category?.toLowerCase() || "";

      return desc.includes(search) || cat.includes(search);
    });

    setFilteredTrans(data ?? []);
  };

  return (
    <form onSubmit={handleSubmitSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Search
          size={20}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400"
        />
        <Input
          name="search"
          className="bg-neutral-100 pl-8"
          placeholder="Search transaction"
        />
      </div>
      <button
        type="button"
        className="flex-none px-2 flex items-center justify-center"
      >
        <ListFilter size={20} />
      </button>
    </form>
  );
}
