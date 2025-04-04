import React, { InputHTMLAttributes, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeClosed } from "lucide-react";

interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
  name?: string;
}

function InputPassword({ children, name, ...props }: InputPasswordProps) {
  const [seePassword, setSeePassword] = useState(false);
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={name}>{children}</Label>
      <div className="relative w-full">
        <Input
          {...props}
          type={seePassword ? "text" : "password"}
          id={name}
          name={name}
        />
        <button
          onClick={() => setSeePassword(!seePassword)}
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          {seePassword ? <Eye /> : <EyeClosed />}
        </button>
      </div>
    </div>
  );
}

export default InputPassword;
