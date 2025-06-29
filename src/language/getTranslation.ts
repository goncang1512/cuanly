"use server";
import en from "./en/translation.json";
import id from "./id/translation.json";
import { cookies } from "next/headers";

export async function getTransaltion() {
  const lang = (await cookies()).get("lang")?.value ?? "en";
  return lang === "id" ? id : en;
}
