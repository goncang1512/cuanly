import { useEffect, useState, useCallback, useActionState } from "react";
import { ApiResponse } from "../types";

export function useFormActionState<FormValueType>(
  actionFn: (prevState: ApiResponse, payload: FormData) => Promise<ApiResponse>,
  defaultValue: FormValueType,
  onDefault: boolean = true
) {
  const [formValue, setFormValue] = useState<FormValueType>(defaultValue);
  const [message, setMessage] = useState<string | null>(null);

  const initialState: ApiResponse = {
    status: false,
    message: "",
    statusCode: 500,
  };

  const [state, formAction, isPending] = useActionState<ApiResponse, FormData>(
    actionFn,
    initialState
  );

  useEffect(() => {
    // reset hanya saat status success dan form submit sukses (bukan waktu user ngetik)
    if (!isPending && state?.status && onDefault) {
      setFormValue(defaultValue);
    }

    // optionally handle error
    if (!isPending && !state?.status && state?.statusCode === 422) {
      setMessage(String(state?.message));
    }
  }, [state, isPending]);

  const updateForm = useCallback((updatedFields: Partial<FormValueType>) => {
    setFormValue((prev) => ({ ...prev, ...updatedFields }));
  }, []);

  return {
    formValue,
    setFormValue: updateForm,
    message,
    formAction,
    isPending,
    state,
  };
}
