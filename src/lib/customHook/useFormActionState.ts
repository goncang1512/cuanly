import { useEffect, useState, useCallback, useActionState } from "react";
import { ApiResponse } from "../types";

export function useFormActionState<FormValueType>(
  actionFn: (prevState: ApiResponse, payload: FormData) => Promise<ApiResponse>,
  defaultValue: FormValueType
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
    if (!isPending && !state?.status && state?.statusCode === 422) {
      setMessage(String(state?.message));
    }

    if (!isPending && state?.status) {
      setFormValue((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(defaultValue)) {
          return defaultValue;
        }
        return prev;
      });
    }
  }, [state, isPending, defaultValue]);

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
