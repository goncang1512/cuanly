import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CuanLy",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-inter antialiased bg-neutral-50`}>
        <NextTopLoader color="#3cbf8f" height={2} showSpinner={false} />
        {children}
        <Toaster className="bg-red-400" />
      </body>
    </html>
  );
}
