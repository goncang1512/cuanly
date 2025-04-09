import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TransactionType } from "@/lib/types";
import { TransactionShow } from "../TransactionCard";
import { CircleHelp, RefreshCcw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

function LastTransaction({ transaction }: { transaction: TransactionType[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="item-1"
        className="bg-neutral-100 rounded-md py-0 px-3"
      >
        <AccordionTrigger
          classIcon={`${transaction.length > 0 ? "flex" : "hidden"}`}
          className="justify-center py-3 hover:no-underline"
        >
          <div className="flex items-center gap-1">
            <span>Last Activity</span>
            <Popover>
              <PopoverTrigger asChild>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer"
                >
                  <CircleHelp size={15} />
                </div>
              </PopoverTrigger>
              <PopoverContent onClick={(e) => e.stopPropagation()}>
                <p className="text-sm text-center">
                  Will only display transactions from one day ago.
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </AccordionTrigger>
        {transaction.map((data, index) => {
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
            <AccordionContent
              key={data?.id}
              className={`${
                index + 1 === transaction.length ? "" : "border-b"
              } flex px-0 py-0 items-center justify-between border-neutral-300`}
            >
              <TransactionShow
                colorSeparator={colorSeparator}
                separator={separator}
                data={data}
              />
            </AccordionContent>
          );
        })}
      </AccordionItem>
    </Accordion>
  );
}

export default LastTransaction;
