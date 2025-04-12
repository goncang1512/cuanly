"use client";
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
import InputPassword from "../fragments/InputPassword";
import { LoaderCircle } from "lucide-react";
import { registerUser } from "@/actions/user.action";
import { useActionState, useEffect, useState } from "react";
import SocialAuth from "./SocialAuth";

function RegisterForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const [state, formAction, isPending] = useActionState(registerUser, null);

  useEffect(() => {
    setMessage("");
    if (state?.statusCode === 422 && !isPending) {
      setMessage(state.message);
    } else {
      setMessage("");
    }

    if (state?.status) {
      router.push("/auth?form=sign-in");
    }
  }, [isPending, state]);

  return (
    <form action={formAction}>
      <Card className={`w-full gap-3`}>
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription className="text-red-500">{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <SocialAuth />

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
          <Button disabled={isPending} type="submit">
            {isPending ? <LoaderCircle className="animate-spin" /> : "Sign up"}
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
