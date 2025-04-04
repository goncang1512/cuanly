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
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";
import InputPassword from "../fragments/InputPassword";

function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setLoading(true);
    setMessage("");
    await authClient.signIn.email(
      {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        callbackURL: "/",
      },
      {
        onError: (ctx) => {
          setLoading(false);
          setMessage(ctx.error?.message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSignIn}>
      <Card className={` w-full`}>
        <CardHeader>
          <CardTitle className="text-xl">Sign In</CardTitle>
          <CardDescription className="text-red-500">{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" placeholder="Email" />
            </div>
            <InputPassword name="password" placeholder="Password">
              Password
            </InputPassword>
          </div>
        </CardContent>
        <CardFooter className="flex items-end gap-3 flex-col">
          <Button disabled={loading} type="submit">
            {loading ? <LoaderCircle className="animate-spin" /> : "Sign in"}
          </Button>
          <p className="w-full text-center">
            Don&apos;t have account?{" "}
            <button
              type="button"
              onClick={() => router.push("?form=sign-up")}
              className="text-blue-500"
            >
              Sign Up
            </button>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}

export default LoginForm;
