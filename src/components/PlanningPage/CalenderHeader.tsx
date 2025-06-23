import { ArrowLeft, ArrowRight } from "lucide-react";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function CalendarHeader({
  month,
  year,
  onPrev,
  onNext,
}: {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={onPrev}
        className="px-3 py-1 bg-emerald text-white rounded"
      >
        <ArrowLeft />
      </button>
      <h2 className="text-xl font-bold">
        {monthNames[month]} {year}
      </h2>
      <button
        onClick={onNext}
        className="px-3 py-1 bg-emerald text-white rounded"
      >
        <ArrowRight />
      </button>
    </div>
  );
}
