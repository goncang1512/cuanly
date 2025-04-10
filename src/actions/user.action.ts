"use server";
import { auth } from "@/lib/auth";
import { AppError } from "@/lib/customHook/AppError";
import { generateWalletId } from "@/lib/generateId";
import prisma from "@/lib/prisma";
import { ApiResponse, UserType } from "@/lib/types";
import { APIError } from "better-call";
import { revalidatePath } from "next/cache";

export const registerUser = async (
  prevState: unknown,
  formData: FormData
): Promise<ApiResponse<UserType | APIError | null>> => {
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
      },
    });

    return {
      status: true,
      statusCode: 201,
      message: "Success create user",
      results: data?.user,
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

export const updateUserProfile = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const data = await prisma.user.update({
      where: {
        id: formData.get("user_id") as string,
      },
      data: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phonenumber: formData.get("phone-number") as string,
      },
    });

    revalidatePath(`/profile/@${data.name}`);
    return {
      status: true,
      statusCode: 200,
      message: "Success edit profile",
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
      status: true,
      statusCode: 500,
      message: "Internal Server Error",
      results: null,
    };
  }
};
