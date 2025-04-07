"use server";

import prisma from "@/lib/prisma";
import { generateId } from "better-auth";
import { $Enums } from "@prisma/client";
import { TransactionType } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const addMoneyWallet = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const type = formData.get("type") as $Enums.TransType;

    let data: TransactionType;
    if (type === "move") {
      data = await prisma.transaction.create({
        data: {
          id: generateId(32),
          category: "switch-money",
          userId: formData.get("user_id") as string,
          fromId: formData.get("from_id") as string,
          walletId: formData.get("to_id") as string,
          description: formData.get("description") as string,
          type: type,
          balance: Number(formData.get("amount")),
        },
      });
    } else {
      data = await prisma.transaction.create({
        data: {
          id: generateId(32),
          category: formData.get("category") as string,
          userId: formData.get("user_id") as string,
          walletId: formData.get("wallet_id") as string,
          description: formData.get("description") as string,
          type: type,
          balance: Number(formData.get("amount")),
        },
      });
    }

    if (data) {
      const check = type === "add";

      await prisma.wallet.update({
        where: {
          id: data?.fromId ?? data?.walletId,
        },
        data: {
          balance: check
            ? { increment: data.balance }
            : { decrement: data.balance },
        },
      });

      if (type === "move") {
        await prisma.wallet.update({
          where: {
            id: String(data?.walletId),
          },
          data: {
            balance: {
              increment: data.balance,
            },
          },
        });
      }
    }

    revalidatePath(`/wallet/${data?.fromId ?? data?.walletId}`);
    return {
      status: true,
      statusCode: 201,
      message: "Success create transaction",
      results: data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      results: null,
    };
  }
};

export const deleteTransaction = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const data = await prisma.transaction.update({
      where: {
        id: formData.get("trans_id") as string,
      },
      data: {
        status: "delete",
      },
    });

    revalidatePath(`/wallet/${data?.id}`);
    return {
      status: true,
      statusCode: 200,
      message: "Success delete transaction",
      reuslts: data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      results: null,
    };
  }
};
