import { useCallback } from "react";
import { usePOST } from "./api";

export const useResendTemporaryPassword = (id: string) => {
  const { mutateAsync, isPending } = usePOST({
    resourcePath: `admin/resend-temp-password/${id}`, // ✅ id in the URL
    queryKey: ["userRequests", "resend-password", id],
  });

  const resend = useCallback(async () => {
    try {
      const response = await mutateAsync({});
      console.log(response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, [mutateAsync]); // mutateAsync is stable from React Query

  return {
    resend,
    isPending,
  };
};
