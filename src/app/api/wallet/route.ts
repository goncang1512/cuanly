import { auth } from "@/lib/auth";
import { generateWalletId } from "@/lib/generateId";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session || !session.user) {
    return NextResponse.redirect("/login");
  }

  const user = session.user;
  const exists = await prisma.wallet.findFirst({
    where: {
      userId: user?.id,
      name: "Dompet Utama",
    },
  });

  if (!exists) {
    await prisma.wallet.create({
      data: {
        id: generateWalletId(),
        name: "Dompet Utama",
        userId: user?.id,
        type: "self",
        kategori: "wallet",
        category: "default",
        balance: 0,
      },
    });
  }

  return NextResponse.redirect(`${process.env.BETTER_AUTH_URL}/`);
};
