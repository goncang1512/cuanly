"use client";
import { inviteMember } from "@/actions/member.action";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormActionState } from "@/lib/customHook/useFormActionState";
import { Loader2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function NavbarGroup({
  params,
}: {
  params: Promise<{ wallet_id: string }>;
}) {
  const { wallet_id } = React.use(params);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [onDialog, setOnDialog] = useState(false);
  const { formValue, setFormValue, formAction, isPending, state } =
    useFormActionState(inviteMember, {
      email: "",
    });

  useEffect(() => {
    if (!state.status) {
      setErrMsg(state.message);
    } else {
      setOnDialog(false);
    }
  }, [state]);

  return (
    <TopBar
      title="Group"
      renderChildren={({ iconSize }) => (
        <div className="flex gap-3 items-center">
          <Dialog
            open={onDialog}
            onOpenChange={(e) => {
              setOnDialog(e);
              if (!e) {
                setErrMsg(null);
                setFormValue({ ...formValue, email: "" });
              }
            }}
          >
            <DialogTrigger>
              <Plus size={iconSize} />
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Invite member</DialogTitle>
              {errMsg && (
                <DialogDescription className="text-red-500 text-center">
                  {errMsg}
                </DialogDescription>
              )}
              <form
                className="grid gap-3"
                action={(formData) => {
                  formData.append("wallet_id", wallet_id);
                  formAction(formData);
                }}
              >
                <Label>Email</Label>
                <Input
                  value={formValue.email}
                  onChange={(e) =>
                    setFormValue({ ...formValue, email: e.target.value })
                  }
                  name="email"
                  placeholder="example@gmail.com"
                />

                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader2 className="animate-spin" /> : "Invite"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    />
  );
}
