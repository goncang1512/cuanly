"use server";
import { auth } from "@/lib/auth";
import { AppError } from "@/lib/customHook/AppError";
import prisma from "@/lib/prisma";
import { ApiResponse, TPlanning } from "@/lib/types";
import { $Enums } from "@prisma/client";
import { generateId } from "better-auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const createPlanning = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const isoDeadline = new Date(formData.get("date") as string).toISOString();
    const data = await prisma.planning.create({
      data: {
        id: generateId(32),
        name: formData.get("name") as string,
        price: Number(formData.get("amount")),
        icon: formData.get("newIcon") as string,
        description: formData.get("description") as string,
        deadline: isoDeadline,
        userId: formData.get("user_id") as string,
        recurrenceType: formData.get("recurrence") as $Enums.RecurenceT,
      },
    });

    revalidatePath("/planning");
    return {
      status: true,
      statusCode: 201,
      message: "Success create planning",
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

export const getMyPlanning = async (): Promise<
  ApiResponse<TPlanning[] | null>
> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const data = await prisma.planning.findMany({
      where: {
        userId: session?.user?.id,
      },
    });

    return {
      status: true,
      statusCode: 200,
      message: "Success get my planning",
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

export const deletePlanning = async (
  prevState: unknown,
  formData: FormData
): Promise<ApiResponse<TPlanning | null>> => {
  const planId = formData.get("plan_id") as string;
  try {
    const data = await prisma.planning.delete({
      where: {
        id: planId,
      },
    });

    revalidatePath("/planning");
    return {
      status: true,
      statusCode: 200,
      message: "Success get my planning",
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
