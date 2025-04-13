import { deletePlanning } from "@/actions/planning.action";
import { PlanningContext } from "@/lib/context/PlanningContext";
import { iconFn } from "@/lib/dynamicIcon";
import { formatDate } from "@/lib/time";
import { TPlanning } from "@/lib/types";
import { LoaderCircle, Trash2 } from "lucide-react";
import React, { useActionState, useContext } from "react";

export default function FilterPlanning() {
  const { planningOptimis, filterPlanning } = useContext(PlanningContext);

  const data = filterPlanning.length > 0 ? filterPlanning : planningOptimis;

  return (
    <div className="pt-2">
      <h1 className="font-semibold text-xl">Schedule</h1>
      <div className="grid gap-2">
        {data.map((data: TPlanning) => {
          return <PlanningShow key={data.id} data={data} />;
        })}
      </div>
    </div>
  );
}

const PlanningShow = ({ data }: { data: TPlanning }) => {
  const { Icon, iconData } = iconFn(data?.icon);
  const [, formAction, isPending] = useActionState(deletePlanning, null);

  return (
    <div className="flex items-center w-full justify-between">
      <div className="flex items-center gap-2">
        <div
          className="p-1 rounded-md"
          style={{ backgroundColor: iconData?.color }}
        >
          <Icon size={30} />
        </div>
        <div className="flex flex-col leading-4">
          <h1>{data?.name}</h1>
          <p className="font-medium">Rp{data?.price.toLocaleString("id-ID")}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p>{formatDate(String(data?.deadline))}</p>
        <form
          action={(formData) => {
            formData.append("plan_id", data?.id);
            formAction(formData);
          }}
        >
          <button type="submit" className="hover:bg-neutral-200 p-1 rounded-md">
            {isPending ? (
              <LoaderCircle className="animate-spin" size={20} />
            ) : (
              <Trash2 size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
