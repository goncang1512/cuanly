"use server";
import { AppError } from "@/lib/customHook/AppError";
import prisma from "@/lib/prisma";
import { generateId } from "better-auth";
import { endOfMonth, startOfMonth } from "date-fns";
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

export const getWalletMember = async (wallet_id: string, date: Date) => {
  try {
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);

    const result = await prisma.member.findMany({
      where: {
        walletId: wallet_id,
      },
      select: {
        user: {
          select: {
            name: true,
            id: true,
            fromLedger: {
              where: {
                walletId: wallet_id,
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
              },
              include: {
                from: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
                to: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
              orderBy: [{ status: "asc" }, { createdAt: "desc" }],
            },
          },
        },
      },
    });

    const users: { id: string; name: string | null }[] = [];
    const fromLedger = [];

    for (const { user } of result) {
      const { id, name, fromLedger: fromL } = user;

      users.push({ id, name });
      fromLedger.push(...fromL);
    }

    fromLedger.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "unpaid" ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return {
      status: true,
      statusCode: 200,
      message: "Success",
      results: { users, fromLedger },
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

export const getMontLedger = async (wallet_id: string) => {
  try {
    const result = await prisma.$queryRaw<
      { createdAt: Date }[]
    >`SELECT DISTINCT ON (DATE_TRUNC('month', "createdAt")) "createdAt"
      FROM "ledger"
      WHERE "walletId" = ${wallet_id}
      ORDER BY DATE_TRUNC('month', "createdAt"), "createdAt" ASC`;

    return {
      status: true,
      statusCode: 200,
      message: "Success get month ledger",
      results: result,
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

export const checkMember = async (wallet_id: string) => {
  try {
    const member = await prisma.member.findMany({
      where: {
        walletId: wallet_id,
      },
      select: {
        userId: true,
      },
    });

    return {
      status: true,
      statusCode: 200,
      message: "Success get member user",
      results: member.map((data) => data.userId),
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
