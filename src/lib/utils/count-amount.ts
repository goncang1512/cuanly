import { TransactionType } from "../types";

export const countAmount = (
  walletId: string,
  transaction: TransactionType[]
) => {
  return transaction.reduce((total, tx) => {
    if (tx.type === "add") {
      return total + tx.balance;
    }

    if (tx.type === "pay" || tx.type === "transfer") {
      return total - tx.balance;
    }

    if (tx.type === "move") {
      if (tx.fromId === walletId) {
        return total - tx.balance;
      }

      if (tx.fromId !== walletId) {
        return total + tx.balance;
      }
    }

    return total;
  }, 0);
};
