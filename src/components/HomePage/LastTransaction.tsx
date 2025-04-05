import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TransactionType } from "@/lib/types";
import { TransactionShow } from "../TransactionCard";

function LastTransaction({ transaction }: { transaction: TransactionType[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="item-1"
        className="bg-neutral-100 rounded-md py-0 px-3"
      >
        <AccordionTrigger className="justify-center py-3">
          Last Activity
        </AccordionTrigger>
        {transaction.map((data, index) => {
          return (
            <AccordionContent
              key={data?.id}
              className={`${
                index + 1 === transaction.length ? "" : "border-b"
              } px-3 py-2 flex items-center justify-between border-neutral-300`}
            >
              <TransactionShow data={data} />
            </AccordionContent>
          );
        })}
      </AccordionItem>
    </Accordion>
  );
}

export default LastTransaction;
