"use server";
import { auth } from "@/lib/auth";
import { AppError } from "@/lib/customHook/AppError";
import { generateWalletId } from "@/lib/generateId";
import prisma from "@/lib/prisma";
import { ApiResponse, WalletType } from "@/lib/types";
import { countAmount } from "@/lib/utils/count-amount";
import { $Enums } from "@prisma/client";
import { generateId } from "better-auth";
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getWallet = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = String(session?.user?.id);
    const now = new Date();

    const wallet = await prisma.wallet.findFirst({
      where: { userId, name: "Dompet Utama" },
      include: {
        transaction: {
          select: {
            id: true,
            type: true,
            balance: true,
          },
        },
      },
    });

    const todayTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        status: "aktif",
        createdAt: {
          gte: startOfDay(now),
          lte: endOfDay(now),
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        wallet: true,
        fromWallet: true,
      },
    });

    const monthTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        status: "aktif",
        createdAt: {
          gte: startOfMonth(now),
          lte: endOfMonth(now),
        },
      },
      select: {
        type: true,
        balance: true,
      },
    });

    const { income, expand, transfer } = monthTransactions.reduce(
      (acc, { type, balance }) => {
        if (type === "add") acc.income += balance;
        else if (type === "pay" || type === "transfer") acc.expand += balance;
        else if (type === "move" || type === "adjust") acc.transfer += balance;
        return acc;
      },
      { income: 0, expand: 0, transfer: 0 }
    );

    if (!wallet) throw new AppError("Wallet not found", 422);
    const { transaction: newTransaction, ...result } = wallet;
    const countBalance = countAmount(String(result?.id), newTransaction ?? []);

    return {
      status: true,
      statusCode: 200,
      message: "Success get wallet",
      results: {
        wallet: { ...result, balance: countBalance ?? 0 },
        transaction: todayTransactions,
        pieChart: { income, expand, transfer },
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        status: false,
        statusCode: error.statusCode,
        message: error.message,
        results: {
          wallet: null,
          transaction: [],
          pieChart: { income: 0, expand: 0, transfer: 0 },
        },
      };
    }

    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      results: {
        wallet: null,
        transaction: [],
        pieChart: { income: 0, expand: 0, transfer: 0 },
      },
    };
  }
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
        kategori: formData.get("newicon") as string,
        userId: formData.get("user_id") as string,
        category: formData.get("category") as $Enums.CateWallet,
      },
    });

    if (data.type === "group") {
      await prisma.member.create({
        data: {
          id: generateId(32),
          userId: formData.get("user_id") as string,
          walletId: data?.id,
        },
      });
    }

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
    const memberGroup = await prisma.member.findMany({
      where: {
        userId: user_id,
      },
      select: {
        wallet: {
          include: {
            transaction: {
              select: {
                id: true,
                type: true,
                balance: true,
              },
            },
          },
        },
      },
    });

    const groupWallet = memberGroup.flatMap((data) => data.wallet);

    let results = [];

    if (typeFilter === "group") {
      results = groupWallet;
    } else {
      const selfWallets = await prisma.wallet.findMany({
        where: {
          userId: user_id,
          type: {
            not: "group",
          },
          ...(typeFilter !== undefined && { type: typeFilter }),
        },
        include: {
          transaction: {
            select: {
              balance: true,
              id: true,
              type: true,
            },
          },
        },
      });

      const filteredWallet = selfWallets.sort((a, b) => {
        if (a.name === "Dompet Utama") return -1;
        if (b.name === "Dompet Utama") return 1;
        return a.name.localeCompare(b.name);
      });

      if (type === "all") {
        results = [...filteredWallet, ...groupWallet];
      } else {
        results = filteredWallet;
      }
    }

    const updateResult = results.map((data: WalletType) => {
      const { transaction, ...result } = data;
      const amount = countAmount(result?.id, transaction ?? []);
      return {
        ...result,
        balance: amount ?? 0,
      };
    });

    return {
      status: true,
      statusCode: 200,
      message: "Success get my pocket",
      results: updateResult,
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        status: false,
        statusCode: error.statusCode,
        message: error.message,
        results: [],
      };
    }
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

    const amount = countAmount(String(data?.id), transaction);

    return {
      status: true,
      statusCode: 200,
      message: "Success get detail wallet",
      results: {
        wallet: { ...data, balance: amount ?? 0 } as WalletType,
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
    const category = formData.get("category") as $Enums.CateWallet;
    const balanceInput = Number(formData.get("balance"));
    const isDebt = category === "receivable";

    const adjustedBalance =
      balanceInput === 0 ? 0 : isDebt ? -Math.abs(balanceInput) : balanceInput;

    const data = await prisma.wallet.update({
      where: {
        id: formData.get("wallet_id") as string,
      },
      data: {
        balance: adjustedBalance,
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

export const getMyWalletTrans = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const user_id = formData.get("user_id") as string;

    const data = await prisma.wallet.findMany({
      where: {
        userId: user_id,
      },
      select: {
        id: true,
        name: true,
        kategori: true,
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
    console.error(error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      results: [],
    };
  }
};

export const updateWallet = async (prevState: unknown, formData: FormData) => {
  try {
    const data = await prisma.wallet.update({
      where: {
        id: formData.get("wallet_id") as string,
      },
      data: {
        name: formData.get("name") as string,
        category: formData.get("category") as $Enums.CateWallet,
        kategori: formData.get("newicon") as string,
        type: formData.get("type") as $Enums.TypeWallet,
      },
    });

    revalidatePath(`/wallet/${data?.id}`);
    return {
      status: true,
      statusCode: 200,
      message: "Success update wallet",
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

export const createEWallet = async (preState: unknown, formData: FormData) => {
  try {
    const exists = await prisma.wallet.findFirst({
      where: {
        userId: String(formData.get("user_id")),
        name: "Dompet Utama",
      },
    });

    let results;
    if (!exists) {
      results = await prisma.wallet.create({
        data: {
          id: generateWalletId(),
          name: "Dompet Utama",
          userId: String(formData.get("user_id")),
          type: "self",
          kategori: "wallet",
          category: "default",
          balance: 0,
        },
      });
    }

    return {
      status: true,
      statusCode: 200,
      message: "Success create main wallet",
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
