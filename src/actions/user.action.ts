"use server";
import { auth } from "@/lib/auth";
import { generateWalletId } from "@/lib/generateId";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { APIError } from "better-call";

export const registerUser = async (
  prevState: any,
  formData: FormData
): Promise<ApiResponse<any>> => {
  try {
    const data = await auth.api.signUpEmail({
      body: {
        name: formData.get("name") as string,
        email: formData.get("email-up") as string,
        password: formData.get("password-up") as string,
      },
    });

    await prisma.wallet.create({
      data: {
        id: generateWalletId(),
        name: "Dompet Utama",
        userId: data?.user?.id,
        kategori: "wallet",
        balance: 0,
      },
    });

    return {
      status: true,
      statusCode: 201,
      message: "Success create user",
      results: data,
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        status: false,
        statusCode: error.statusCode,
        message: error.body?.message || "",
        results: error,
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
