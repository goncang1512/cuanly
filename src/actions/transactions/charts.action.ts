"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfYear, eachMonthOfInterval, format } from "date-fns";
import { headers } from "next/headers";

export const getTransactionChart = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const startOfThisYear = startOfYear(new Date());

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session?.user?.id,
        status: "aktif",
        createdAt: {
          gte: startOfThisYear,
        },
      },
      select: {
        type: true,
        balance: true,
        createdAt: true,
      },
    });

    const months = eachMonthOfInterval({
      start: startOfYear(new Date()),
      end: new Date(),
    });

    const dataPerMonth = months.map((month) => {
      const label = format(month, "MMM"); // label: "Jan", "Feb", dst

      const monthData = transactions.filter((t) => {
        return (
          t.createdAt.getMonth() === month.getMonth() &&
          t.createdAt.getFullYear() === month.getFullYear()
        );
      });

      const income = monthData
        .filter((t) => t.type === "add")
        .reduce((acc, cur) => acc + cur.balance, 0);

      const expand = monthData
        .filter((t) => t.type === "pay" || t.type === "transfer")
        .reduce((acc, cur) => acc + cur.balance, 0);

      const transfer = monthData
        .filter((t) => t.type === "move" || t.type === "adjust")
        .reduce((acc, cur) => acc + cur.balance, 0);

      return {
        label,
        income,
        expand,
        transfer,
      };
    });

    return {
      status: true,
      statusCode: 200,
      message: "Success get transaction per month",
      results: dataPerMonth,
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
