import axios from "axios";
import { toast } from "sonner";
import { useCallback } from "react";

export const useApiError = () => {
  const handleError = useCallback((error: unknown) => {
    let message = "Something went wrong";

    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.message || // backend: { message: "..." }
        error.response?.data?.error || // backend alternative
        error.message; // network / Axios error
    } else if (error instanceof Error) {
      message = error.message;
    }

    toast.error(message, { duration: 1500 });
  }, []);

  return { handleError };
};
