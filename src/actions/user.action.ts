"use server";
import { auth } from "@/lib/auth";
import { AppError } from "@/lib/customHook/AppError";
import { generateWalletId } from "@/lib/generateId";
import prisma from "@/lib/prisma";
import { ApiResponse, UserType } from "@/lib/types";
import cloudinary from "@/lib/utils/cloudinary";
import { APIError } from "better-call";
import { UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

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
      results: data.user as UserType,
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
  const formImage = formData.get("foto-profile") as File;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    let result: UploadApiResponse | undefined;
    if (formImage && formImage.size > 0) {
      const fileBuffer = await formImage.arrayBuffer();
      const image = new Uint8Array(fileBuffer);
      result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "/mogo-app/foto-profile",
            },
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }

              resolve(result);
            }
          )
          .end(image);
      });
    }

    if (session?.user?.avatarId !== "default") {
      await cloudinary.uploader.destroy(String(session?.user?.avatarId));
    }

    const data = await prisma.user.update({
      where: {
        id: formData.get("user_id") as string,
      },
      data: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phonenumber: formData.get("phone-number") as string,
        avatar: result?.secure_url ?? String(session?.user?.avatar),
        avatarId: result?.public_id ?? String(session?.user?.avatarId),
      },
    });

    revalidatePath(`/profile/${data.id}`);
    return {
      status: true,
      statusCode: 200,
      message: "Success edit profile",
      results: data,
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
