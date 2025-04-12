"use server";
import { AppError } from "@/lib/customHook/AppError";
import prisma from "@/lib/prisma";

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
      },
    });
    return {
      status: true,
      statusCode: 200,
      message: "Success get my wallet",
      results: data,
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
