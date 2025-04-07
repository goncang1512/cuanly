"use server";
import { auth } from "@/lib/auth";
import { AppError } from "@/lib/customHook/AppError";
import { generateWalletId } from "@/lib/generateId";
import prisma from "@/lib/prisma";
import { ApiResponse, WalletType } from "@/lib/types";
import { $Enums } from "@prisma/client";
import { generateId } from "better-auth";
import { endOfDay, startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getWallet = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const data = await prisma.wallet.findFirst({
    where: {
      userId: String(session?.user?.id),
      name: "Dompet Utama",
    },
  });

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const transaction = await prisma.transaction.findMany({
    where: {
      userId: session?.user?.id,
      status: "aktif",
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      wallet: true,
      fromWallet: true,
    },
    take: 5,
  });

  return {
    status: true,
    statusCode: 200,
    message: "Success get wallet",
    results: {
      wallet: data,
      transaction,
    },
  };
};

export const createWallet = async (
  prevState: unknown,
  formData: FormData
): Promise<ApiResponse<WalletType | unknown | AppError>> => {
  try {
    const name = formData.get("name") as string;

    if (name.toLocaleLowerCase() === "dompet utama") {
      throw new AppError("Wallet was used", 422);
    }

    const data = await prisma.wallet.create({
      data: {
        id: generateWalletId(),
        name: formData.get("name") as string,
        type: formData.get("type") as $Enums.TypeWallet,
        kategori: formData.get("kategori") as string,
        userId: formData.get("user_id") as string,
      },
    });

    revalidatePath("/wallet");
    return {
      status: true,
      statusCode: 201,
      message: "Success create e-wallet",
      results: data,
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        status: false,
        statusCode: error.statusCode,
        message: error?.message,
        results: error,
      };
    }

    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      results: error,
    };
  }
};

export const getWalletPage = async (
  user_id: string,
  type?: $Enums.TypeWallet | "all"
): Promise<ApiResponse<WalletType[]>> => {
  try {
    const typeFilter = !type ? "self" : type === "all" ? undefined : type;

    const data = await prisma.wallet.findMany({
      where: {
        userId: user_id,
        ...(typeFilter !== undefined && { type: typeFilter }),
      },
    });

    const sortedWallets = data.sort((a, b) => {
      if (a.name === "Dompet Utama") return -1;
      if (b.name === "Dompet Utama") return 1;
      return a.name.localeCompare(b.name);
    });

    return {
      status: true,
      statusCode: 200,
      message: "Success get my pocket",
      results: sortedWallets,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      results: [],
    };
  }
};

export const detailWallet = async (wallet_id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const data = await prisma.wallet.findFirst({
      where: {
        id: wallet_id,
      },
    });

    const transaction = await prisma.transaction.findMany({
      where: {
        OR: [{ walletId: data?.id }, { fromId: data?.id }],
        status: "aktif",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        wallet: true,
        fromWallet: true,
      },
    });

    const count = await prisma.wallet.count({
      where: {
        userId: session?.user?.id,
        NOT: {
          id: wallet_id,
        },
      },
    });

    return {
      status: true,
      statusCode: 200,
      message: "Success get detail wallet",
      results: {
        wallet: data,
        transaction,
        countWallet: count,
      },
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

export const getMyWallet = async (prevState: unknown, formData: FormData) => {
  try {
    const data = await prisma.wallet.findMany({
      where: {
        userId: formData.get("user_id") as string,
      },
    });

    return {
      status: true,
      statusCode: 200,
      message: "Success get my wallets",
      results: data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      results: [],
    };
  }
};

export const adjestAmount = async (prevState: unknown, formData: FormData) => {
  try {
    const data = await prisma.wallet.update({
      where: {
        id: formData.get("wallet_id") as string,
      },
      data: {
        balance: Number(formData.get("balance")),
      },
    });

    await prisma.transaction.create({
      data: {
        id: generateId(32),
        description: "Amount adjustment",
        category: "adjest-balance",
        walletId: data?.id,
        type: "adjust",
        userId: data?.userId,
        balance: data?.balance,
      },
    });

    revalidatePath(`/wallet/${formData.get("wallet_id")}`);
    return {
      status: true,
      statusCode: 200,
      message: "Success udpate amount",
      results: data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      statusCode: 500,
      message: "Invalid update amount",
      results: null,
    };
  }
};
