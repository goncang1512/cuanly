export function generateWalletId(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(2); // ambil 2 digit terakhir dari tahun
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 01 - 12
  const randomPart = Math.floor(Math.random() * 1_0000_0000)
    .toString()
    .padStart(8, "0");

  return year + month + randomPart;
}
