"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateId } from "better-auth";

export const addMoneyWallet = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const data = await prisma.transaction.create({
      data: {
        id: generateId(32),
        category: formData.get("category") as string,
        userId: formData.get("user_id") as string,
        walletId: formData.get("wallet_id") as string,
        description: formData.get("description") as string,
        type: "add",
        balance: Number(formData.get("amount")),
      },
    });

    if (data) {
      await prisma.wallet.update({
        where: {
          id: formData.get("wallet_id") as string,
        },
        data: {
          balance: {
            increment: data.balance,
          },
        },
      });
    }

    revalidatePath(`/wallet/${formData.get("wallet_id")}`);
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
