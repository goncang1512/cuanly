"use client";
import { updateUserProfile } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { getSrc } from "@/lib/utils/getSrc";
import { LoaderCircle } from "lucide-react";
import React, { InputHTMLAttributes, useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditProfile() {
  const dataSession = authClient.useSession();
  const user = dataSession?.data?.user;
  const [preview, setPreview] = useState("");
  const { setFormValue, formValue, formAction, isPending, state } =
    useFormActionState(
      updateUserProfile,
      {
        name: "",
        email: "",
        phoneNumber: "",
      },
      false
    );

  const src =
    getSrc({
      avatar: user?.avatar || "",
      avatarId: user?.avatarId || "",
      image: user?.image || "",
    }) ?? "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  useEffect(() => {
    if (!user) return;

    setFormValue({
      name: user?.name,
      email: user?.email,
      phoneNumber: user?.phonenumber || "",
    });
  }, [user]);

  useEffect(() => {
    if (state.status) {
      toast("Success updated profile data", {
        description: "Success",
      });
    }
  }, [state]);

  return (
    <form
      action={(formData) => {
        formData.append("user_id", String(user?.id));
        formAction(formData);
      }}
      className="flex justify-center py-5 md:px-0 px-4"
    >
      <div className="flex flex-col gap-3 justify-center items-center w-full">
        <div className="flex flex-col gap-3 items-center">
          {preview || src ? (
            <img
              src={`${preview || src}`}
              alt=""
              className="size-32 border rounded-full object-cover"
            />
          ) : (
            <Skeleton className="size-32 border rounded-full bg-neutral-200" />
          )}
          <Label
            className="font-bold underline text-xl cursor-pointer"
            htmlFor="foto-profile"
          >
            Edit
          </Label>
          <input
            onChange={handleFileChange}
            id="foto-profile"
            accept="image/*"
            type="file"
            name="foto-profile"
            hidden
          />
        </div>

        <InputEdit
          value={formValue.name}
          onChange={(e) => setFormValue({ ...formValue, name: e.target.value })}
          name="name"
          type="text"
          placeholder="name"
          required
        >
          Name
        </InputEdit>
        <InputEdit
          value={formValue.email}
          onChange={(e) =>
            setFormValue({ ...formValue, email: e.target.value })
          }
          name="email"
          placeholder="example@gg.com"
          type="email"
          required
        >
          Email
        </InputEdit>
        <InputEdit
          value={formValue.phoneNumber}
          onChange={(e) =>
            setFormValue({ ...formValue, phoneNumber: e.target.value })
          }
          name="phone-number"
          placeholder="+628123353122"
          type="text"
        >
          Phone number
        </InputEdit>

        <Button type="submit" className="w-full md:w-sm">
          {isPending ? (
            <LoaderCircle size={20} className="animate-spin" />
          ) : (
            "Edit profile"
          )}
        </Button>
      </div>
    </form>
  );
}

interface InputEditProps extends InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
  name: string;
}

const InputEdit = ({ children, name, ...props }: InputEditProps) => {
  return (
    <div className="md:w-sm w-full bg-neutral-200 p-2 px-3 rounded-md">
      <Label htmlFor={name} className="text-neutral-700">
        {children}
      </Label>
      <input id={name} name={name} className="w-full outline-0" {...props} />
    </div>
  );
};
