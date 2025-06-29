"use client";
import React from "react";
import TopBar from "../TopBar";
import { useTranslation } from "@/language/useLanguage";

export default function NavbarCharts() {
  const { lang } = useTranslation();
  return <TopBar title={lang.charts_page.title} renderChildren={() => null} />;
}
