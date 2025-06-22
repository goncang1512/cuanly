"use server";

import { AppError } from "@/lib/customHook/AppError";
import prisma from "@/lib/prisma";
import { generateId } from "better-auth";

export const createLedger = async (prevState: unknown, formData: FormData) => {
  try {
    const result = await prisma.ledger.create({
      data: {
        id: generateId(32),
        fromId: formData.get("piutang") as string,
        toId: formData.get("utang") as string,
        amount: Number(formData.get("amount")),
      },
    });

    return {
      status: true,
      statusCode: 201,
      message: "Success create ledger",
      results: result,
    };
  } catch (error) {
    console.log(error);
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
