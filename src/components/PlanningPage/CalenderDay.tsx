export function CalendarDay({
  current,
  isCurrentMonth,
  isToday,
  matchedPlanning,
  handleClickDate,
}: {
  current: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  matchedPlanning: boolean;
  handleClickDate: (date: Date) => void;
}) {
  const isPrevOrNextMonth = !isCurrentMonth;

  const classNames = `text-center p-2 border rounded cursor-pointer 
    ${isPrevOrNextMonth ? "text-gray-400" : ""}
    ${
      matchedPlanning
        ? isCurrentMonth
          ? "bg-emerald-500 text-white"
          : "bg-emerald-200 text-neutral-600"
        : ""
    }`;

  return (
    <div
      key={current.toISOString()}
      onClick={() => handleClickDate(current)}
      className={classNames}
    >
      {isToday ? (
        <span className="bg-blue-500 p-1 text-white rounded-full">
          {current.getDate()}
        </span>
      ) : (
        current.getDate()
      )}
    </div>
  );
}
