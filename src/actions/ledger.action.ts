"use server";

import { AppError } from "@/lib/customHook/AppError";
import prisma from "@/lib/prisma";
import { generateId } from "better-auth";
import { revalidatePath } from "next/cache";

export const createLedger = async (prevState: unknown, formData: FormData) => {
  try {
    const tabs = formData.get("tabs");
    const utang = formData.get("utang") as string;
    const piutang = formData.get("piutang") as string;

    const valueUtang = tabs === "utang" ? utang : JSON.parse(utang);
    const valuePiutang = tabs === "piutang" ? piutang : JSON.parse(piutang);
    const amount = Number(formData.get("amount"));
    const walletId = formData.get("wallet_id") as string;

    const createData = [];

    // Case: banyak piutang, satu utang
    if (Array.isArray(valuePiutang) && typeof valueUtang === "string") {
      for (const piutang of valuePiutang) {
        createData.push({
          id: generateId(32),
          fromId: piutang.id,
          toId: valueUtang,
          amount,
          walletId,
        });
      }
    } else if (typeof valuePiutang === "string" && Array.isArray(valueUtang)) {
      for (const utang of valueUtang) {
        createData.push({
          id: generateId(32),
          fromId: valuePiutang,
          toId: utang.id,
          amount,
          walletId,
        });
      }
    }

    const result = await prisma.ledger.createMany({
      data: createData,
      skipDuplicates: true, // opsional: jika id unik
    });

    revalidatePath(`/wallet/group/${formData.get("wallet_id") as string}`);
    return {
      status: true,
      statusCode: 201,
      message: "Success create ledger",
      results: result,
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

export const paidLedger = async (prevState: unknown, formData: FormData) => {
  try {
    const paid = Number(formData.get("paid"));
    const paidMount = Number(formData.get("paid_mount"));
    const ledgerId = String(formData.get("ledger_id"));

    if (isNaN(paidMount) || paidMount < 0) {
      throw new AppError("Nilai pembayaran tidak boleh negatif", 422);
    }

    if (paidMount > paid) {
      throw new AppError("Pembayaran melebihi jumlah utang", 422);
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update paidMount
      const updated = await tx.ledger.update({
        where: { id: ledgerId },
        data: {
          paidMount: {
            increment: paidMount,
          },
        },
      });

      console.log({ updated, paidMount });

      // 2. Jika sudah lunas, update status
      if (updated.paidMount === updated.amount) {
        return await tx.ledger.update({
          where: { id: ledgerId },
          data: {
            status: "paid",
          },
        });
      }

      return updated;
    });

    revalidatePath(`/wallet/group/${formData.get("wallet_id")}`);
    return {
      status: true,
      statusCode: 201,
      message: "Succes paid ledger",
      results: result,
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

export const canceledLedger = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const results = await prisma.ledger.update({
      where: {
        id: formData.get("ledger_id") as string,
      },
      data: {
        paidMount: 0,
        status: "unpaid",
      },
    });

    revalidatePath(`/wallet/group/${formData.get("wallet_id")}`);
    return {
      status: true,
      statusCode: 201,
      message: "Succes paid ledger",
      results: results,
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

export const deleteLedger = async (prevState: unknown, formData: FormData) => {
  try {
    const results = await prisma.ledger.delete({
      where: {
        id: formData.get("ledger_id") as string,
      },
    });

    revalidatePath(`/wallet/group/${formData.get("wallet_id")}`);
    return {
      status: true,
      statusCode: 201,
      message: "Succes paid ledger",
      results: results,
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
