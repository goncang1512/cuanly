"use client";
import React from "react";
import TopBar from "../TopBar";
import { useTranslation } from "@/language/useLanguage";

export default function NavbarWallet() {
  const { lang } = useTranslation();
  return <TopBar title={lang.wallet_page.title} renderChildren={() => null} />;
}
