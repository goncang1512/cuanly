import {
  eachDayOfInterval,
  endOfMonth,
  getDay,
  getMonth,
  getYear,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { TPlanning } from "../types";

export const planningTime = (
  currentDate: Date,
  planning?: TPlanning[] | null
) => {
  for (const plan of planning || []) {
    const deadline = new Date(plan.deadline);

    if (
      plan.recurrenceType === "weekly" &&
      deadline.getDay() === currentDate.getDay()
    ) {
      return { matchedPlanning: true, planningMatch: plan };
    }

    if (
      plan.recurrenceType === "monthly" &&
      deadline.getDate() === currentDate.getDate()
    ) {
      return { matchedPlanning: true, planningMatch: plan };
    }

    if (
      plan.recurrenceType === "yearly" &&
      deadline.getDate() === currentDate.getDate() &&
      deadline.getMonth() === currentDate.getMonth()
    ) {
      return { matchedPlanning: true, planningMatch: plan };
    }

    if (
      plan.recurrenceType === "ontime" &&
      deadline.toDateString() === currentDate.toDateString()
    ) {
      return { matchedPlanning: true, planningMatch: plan };
    }
  }

  return { matchedPlanning: false, planningMatch: null };
};

export function getPlanningThisMonth(planningOptimis: TPlanning[], date: Date) {
  const currentMonth = getMonth(date);
  const currentYear = getYear(date);

  const filtered = planningOptimis.filter((item) => {
    const deadline = new Date(item.deadline);

    switch (item.recurrenceType) {
      case "ontime":
        return isSameMonth(deadline, date) && getYear(deadline) === currentYear;

      case "monthly":
        return (
          getYear(deadline) < currentYear ||
          (getYear(deadline) === currentYear &&
            getMonth(deadline) <= currentMonth)
        );

      case "weekly":
        return (
          getYear(deadline) < currentYear ||
          (getYear(deadline) === currentYear &&
            getMonth(deadline) <= currentMonth)
        );

      case "yearly":
        return getMonth(deadline) === currentMonth;

      default:
        return false;
    }
  });

  const total = filtered.reduce((sum, item) => {
    const deadline = new Date(item.deadline);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    if (item.recurrenceType === "weekly") {
      // Hitung semua hari dalam bulan
      const allDaysInMonth = eachDayOfInterval({ start, end });

      // Cari hari apa deadline jatuh (misalnya hari Jumat)
      const deadlineDay = getDay(deadline); // 0 = Minggu, 1 = Senin, ..., 5 = Jumat

      // Hitung berapa banyak hari yang sama dengan deadline (misalnya Jumat) dalam bulan tersebut
      const activeDays = allDaysInMonth.filter(
        (day) => getDay(day) === deadlineDay
      );

      return sum + item.price * activeDays.length;
    }

    return sum + item.price;
  }, 0);

  return {
    data: filtered,
    totalPrice: total,
  };
}
