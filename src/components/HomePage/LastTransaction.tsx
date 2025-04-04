import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShirtIcon } from "lucide-react";

function LastTransaction() {
  const banyak = 5;
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="item-1"
        className="bg-neutral-100 rounded-md py-0 px-3"
      >
        <AccordionTrigger className="justify-center py-3">
          Last Activity
        </AccordionTrigger>
        {Array.from({ length: banyak }).map((_, index) => (
          <AccordionContent
            key={index + 1}
            className={`${
              index + 1 === banyak ? "" : "border-b"
            } px-3 py-2 flex items-center justify-between border-neutral-300`}
          >
            <div className="flex items-center gap-3">
              <ShirtIcon className="bg-rose-300 p-1 rounded-md" size={30} />
              <div>
                <p className="text-sm">Fashion</p>
                <span className="font-semibold">Rp{index + 1}00.000</span>
              </div>
            </div>
            <p>15 Maret 2024</p>
          </AccordionContent>
        ))}
      </AccordionItem>
    </Accordion>
  );
}

export default LastTransaction;
