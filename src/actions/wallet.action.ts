"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export const getWallet = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const data = await prisma.wallet.findFirst({
    where: {
      userId: String(session?.user?.id),
    },
  });

  return {
    status: true,
    statusCode: 200,
    message: "Success get wallet",
    results: data,
  };
};
