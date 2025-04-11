"use server";

import { AppError } from "@/lib/customHook/AppError";

export const createPlanning = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const data = {
      name: formData.get("name") as string,
      amount: Number(formData.get("amount")),
      icon: formData.get("newIcon") as string,
      description: formData.get("description") as string,
      deadline: formData.get("date") as string,
    };

    console.log(data);
    return {
      status: true,
      statusCode: 201,
      message: "Success create planning",
      results: formData,
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
