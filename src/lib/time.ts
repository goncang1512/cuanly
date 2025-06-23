import { format } from "date-fns";
import { id } from "date-fns/locale";

export const formatDate = (date: string) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "Tanggal tidak valid";

  return format(parsedDate, "d MMMM yyyy", { locale: id });
};
