"use server";
import { AppError } from "@/lib/customHook/AppError";
import prisma from "@/lib/prisma";
import { generateId } from "better-auth";
import { revalidatePath } from "next/cache";

export const inviteMember = async (prevState: unknown, formData: FormData) => {
  console.log("HELLO WORLD");
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: formData.get("email") as string,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 422);
    }

    const exist = await prisma.member.findFirst({
      where: {
        userId: user?.id,
        walletId: formData.get("wallet_id") as string,
      },
      select: {
        id: true,
      },
    });

    if (exist) {
      throw new AppError("User has registered", 422);
    }

    const results = await prisma.member.create({
      data: {
        id: generateId(32),
        userId: user?.id as string,
        walletId: formData.get("wallet_id") as string,
      },
    });

    revalidatePath(`/wallet/group/${formData.get("wallet_id") as string}`);
    return {
      status: true,
      statusCode: 201,
      message: "Success create user",
      results,
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

export const getWalletMember = async (wallet_id: string) => {
  try {
    const result = await prisma.member.findMany({
      where: {
        walletId: wallet_id,
      },
      select: {
        user: {
          select: {
            name: true,
            id: true,
            toLedger: true,
            fromLedger: true,
          },
        },
      },
    });

    const user = result.flatMap((data) => data.user);

    return {
      status: true,
      statusCode: 200,
      message: "Success",
      results: user,
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
