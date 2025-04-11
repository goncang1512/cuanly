"use client";
import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Container({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div className={cn("md:px-0 px-3 md:pt-5 pt-4", className)} {...props}>
      {children}
    </div>
  );
}
