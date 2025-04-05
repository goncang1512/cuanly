import { format } from "date-fns";

// Format input string jadi Date object

export const formatDate = (date: string) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "Tanggal tidak valid";

  // Hari 2 digit (dd), bulan tanpa nol di depan (M), tahun 4 digit (yyyy)
  return format(parsedDate, "dd-M-yyyy");
};
