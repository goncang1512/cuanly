"use client";
import React, { useContext, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, X } from "lucide-react";
import { PlanningContext } from "@/lib/context/PlanningContext";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectGroup, SelectValue } from "@radix-ui/react-select";
import { iconFn, icons } from "@/lib/dynamicIcon";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { createPlanning } from "@/actions/planning.action";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";

type FormCrateType = {
  name: string;
  description: string;
  date: Date | null;
  icon: string;
  rawAmount: string;
  amount: string;
};

const formCreatePlanning: FormCrateType = {
  name: "",
  description: "",
  date: null,
  icon: "",
  rawAmount: "",
  amount: "",
};

export default function CreatePlan() {
  const query = useSearchParams();
  const router = useRouter();
  const action = query.get("action");
  const { seeDrawerCreate, setDrawerCreate } = useContext(PlanningContext);
  const { setFormValue, formValue, formAction } = useFormActionState(
    createPlanning,
    formCreatePlanning
  );

  useEffect(() => {
    if (action === "create") {
      setDrawerCreate(true);
    }
  }, [action]);

  const handleClose = () => {
    setDrawerCreate(false);
    const newUrl = window.location.pathname; // hapus semua query
    router.replace(newUrl);
  };

  const { Icon } = formValue.icon ? iconFn(formValue.icon) : { Icon: null };
  const selectedLabel = formValue.icon?.split("-")[1] ?? formValue.icon;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "");

    setFormValue({
      ...formValue,
      amount: numeric ? Number(numeric).toLocaleString("id-ID") : "",
      rawAmount: numeric,
    });
  };

  return (
    <div>
      <Drawer
        open={seeDrawerCreate}
        onOpenChange={setDrawerCreate}
        onClose={() => {
          handleClose();
          setFormValue(formCreatePlanning);
        }}
      >
        <DrawerContent
          aria-describedby="drawer-create-planning"
          buttonClose={false}
          className="data-[vaul-drawer-direction=bottom]:max-h-[100vh] h-screen data-[vaul-drawer-direction=bottom]:rounded-none data-[vaul-drawer-direction=bottom]:border-0"
        >
          <DrawerHeader className="flex justify-center w-full">
            <button
              onClick={() => setDrawerCreate(false)}
              className="absolute right-3 top-2"
            >
              <X />
            </button>
            <DrawerTitle className="text-center">
              Create a payment plan
            </DrawerTitle>
          </DrawerHeader>
          <div className="mx-auto w-full max-w-sm h-[50vh]">
            <form
              action={(formData) => {
                formData.append("amount", formValue.rawAmount);
                formData.append("date", String(formValue.date));
                formAction(formData);
              }}
              className="grid gap-3"
            >
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  value={formValue.name}
                  onChange={(e) =>
                    setFormValue({ ...formValue, name: e.target.value })
                  }
                  name="name"
                  id="name"
                  placeholder="Listrik"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jumlah">Amount</Label>
                <div className="relative flex-1">
                  <Input
                    value={formValue.amount}
                    onChange={handleChange}
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
              </div>
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Select
                  name="newIcon"
                  onValueChange={(value) =>
                    setFormValue({ ...formValue, icon: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    {Icon ? (
                      <div className="flex items-center gap-2">
                        <Icon size={20} />
                        <span className="capitalize">{selectedLabel}</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Choose icon" />
                    )}
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup className="grid grid-cols-4 gap-2">
                      {icons.map((data, index) => {
                        const { Icon } = iconFn(data?.key);
                        return (
                          <SelectItem
                            showCheck={false}
                            value={data?.key}
                            className="w-full flex items-center justify-center px-0 group"
                            key={index}
                          >
                            <Icon size={50} />{" "}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal ",
                      !formValue.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formValue.date ? (
                      format(formValue.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <DatePicker
                    selected={formValue.date}
                    onSelect={(value) =>
                      setFormValue({ ...formValue, date: value })
                    }
                  />
                </PopoverContent>
              </Popover>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  value={formValue.description}
                  onChange={(e) =>
                    setFormValue({ ...formValue, description: e.target.value })
                  }
                  name="description"
                  id="description"
                  className="min-h-32"
                  placeholder="Write in here..."
                />
              </div>

              <Button type="submit">Create planning</Button>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
