"use server";
import prisma from "@/lib/prisma";
import { generateId } from "better-auth";
import { $Enums } from "@prisma/client";
import { TransactionType } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { AppError } from "@/lib/customHook/AppError";

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

    const pathname = formData.get("pathname");
    if (pathname) {
      revalidatePath(String(pathname));
    }
    revalidatePath(`/wallet/${data.fromId ?? data.walletId}`);
    return {
      status: true,
      statusCode: 201,
      message: "Success create transaction",
      results: data,
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

export const deleteTransaction = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const passwordDelete = formData.get("password-delete") as string;

    if (passwordDelete !== "delete") {
      throw new AppError("Invalid password", 422);
    }

    const data = await prisma.transaction.delete({
      where: {
        id: formData.get("trans_id") as string,
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
    if (error instanceof AppError) {
      return {
        status: false,
        statusCode: error.statusCode,
        message: error.message,
        results: null,
      };
    }

    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      results: null,
    };
  }
};

export const updateTransaction = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const amount = Number(formData.get("amount"));
    const transaction_id = String(formData.get("trans_id"));
    const payMethod = formData.get("paymentmethod") as $Enums.TransType;

    const data = await prisma.transaction.update({
      where: {
        id: transaction_id,
      },
      data: {
        description: formData.get("description") as string,
        type: payMethod,
        balance: amount,
        category: formData.get("category") as string,
      },
    });

    revalidatePath(`/wallet/${data?.walletId}`);
    return {
      status: true,
      statusCode: 201,
      message: "Success create transactions",
      results: data,
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
