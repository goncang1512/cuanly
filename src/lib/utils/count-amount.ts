import { TransactionType } from "../types";

export const countAmount = (
  walletId: string,
  transaction: TransactionType[]
) => {
  const amount = transaction.reduce((acc, curr) => acc + curr.balance, 0);

  const totalToSubtract = transaction.reduce((acc, curr) => {
    const isOut =
      curr.type === "pay" ||
      curr.type === "transfer" ||
      (curr.type === "move" && curr.fromId === walletId);

    return isOut ? acc + curr.balance : acc;
  }, 0);

  return amount - totalToSubtract;
};
