import { $Enums } from "@prisma/client";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const formatDate = (date: string, status: $Enums.RecurenceT) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "Tanggal tidak valid";

  switch (status) {
    case "monthly":
      return `Every ${getOrdinal(parsedDate.getDate())}`; // hanya tanggal (1-31)
    case "weekly":
      return `Every ${format(parsedDate, "EEEE", { locale: enUS })}`; // nama hari
    case "yearly":
      return format(parsedDate, "d MMMM", { locale: enUS }); // tanggal dan bulan
    case "onetime":
      return format(parsedDate, "d MMMM yyyy", { locale: enUS }); // lengkap
    default:
      return format(parsedDate, "d MMMM yyyy", { locale: enUS }); // fallback
  }
};

export const formatTanggal = (date: string) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "Tanggal tidak valid";

  return format(parsedDate, "d MMMM yyyy", { locale: enUS });
};
