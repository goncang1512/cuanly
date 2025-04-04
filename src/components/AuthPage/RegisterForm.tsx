"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import InputPassword from "../fragments/InputPassword";
import { LoaderCircle } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setLoading(true);
    setMessage("");
    await authClient.signUp.email(
      {
        email: formData.get("email-up") as string,
        password: formData.get("password-up") as string,
        name: formData.get("name") as string,
        callbackURL: "/auth?form=sign-in",
      },
      {
        onError: (ctx) => {
          setLoading(false);
          setMessage(ctx.error?.message);
        },
        onSuccess: () => {
          setLoading(false);
          router.push("/auth?form=sign-in");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSignUp}>
      <Card className={`w-full gap-3`}>
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription className="text-red-500">{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" name="name" placeholder="Name" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email-up">Email</Label>
              <Input
                type="email"
                id="email-up"
                name="email-up"
                placeholder="Email"
              />
            </div>
            <InputPassword name="password-up" placeholder="Password">
              Password
            </InputPassword>
          </div>
        </CardContent>
        <CardFooter className="flex items-end gap-3 flex-col ">
          <Button disabled={loading} type="submit">
            {loading ? <LoaderCircle className="animate-spin" /> : "Sign up"}
          </Button>
          <p className="w-full text-center">
            Have an account?{" "}
            <button
              type="button"
              onClick={() => {
                router.push("?form=sign-in");
              }}
              className="text-blue-500"
            >
              Sign In
            </button>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}

export default RegisterForm;
