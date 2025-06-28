"use server";
import { AppError } from "@/lib/customHook/AppError";
import prisma from "@/lib/prisma";
import { countAmount } from "@/lib/utils/count-amount";

export const getOneWallet = async (prevState: unknown, formData: FormData) => {
  try {
    const data = await prisma.wallet.findFirst({
      where: {
        userId: formData.get("user_id") as string,
        name: "Dompet Utama",
      },
      select: {
        name: true,
        id: true,
        balance: true,
        transaction: {
          select: {
            id: true,
            type: true,
            balance: true,
            fromId: true,
          },
        },
        moveTransaction: {
          select: {
            id: true,
            type: true,
            balance: true,
            fromId: true,
          },
        },
      },
    });

    if (!data) throw new AppError("Wallet not found", 422);
    const { transaction, moveTransaction, ...result } = data;
    const amount = countAmount(String(result?.id), [
      ...(transaction ?? []),
      ...(moveTransaction ?? []),
    ]);

    return {
      status: true,
      statusCode: 200,
      message: "Success get my wallet",
      results: { ...result, balance: amount ?? 0 },
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
