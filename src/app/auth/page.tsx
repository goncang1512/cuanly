"use client";
import LoginForm from "@/components/AuthPage/LoginForm";
import RegisterForm from "@/components/AuthPage/RegisterForm";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Authentication() {
  const [changeForm, setChangeForm] = useState(false);
  const searchParams = useSearchParams();
  const form = searchParams?.get("form");

  useEffect(() => {
    if (form === "sign-up") {
      setChangeForm(true);
    } else {
      setChangeForm(false);
    }
  }, [form]);

  return (
    <div className="flex h-screen justify-center items-center overflow-hidden">
      <div className="relative w-full  flex items-center justify-center h-[400px] px-0">
        <div
          className={`absolute transition-all md:w-md w-full  max-md:px-4 duration-500 ease-in-out ${
            changeForm
              ? "-translate-x-[100%] scale-75 opacity-0 pointer-events-none"
              : "translate-x-0 scale-100 opacity-100"
          }`}
        >
          <LoginForm />
        </div>
        <div
          className={`absolute transition-all md:w-md w-full max-md:px-4 duration-500 ease-in-out ${
            changeForm
              ? "translate-x-0 scale-100 opacity-100"
              : "translate-x-[100%] scale-75 opacity-0 pointer-events-none"
          }`}
        >
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
