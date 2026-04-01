import { usePOST } from "./api";

export const useResendTemporaryPassword = (id: string) => {
  const { mutateAsync, isPending } = usePOST({
    resourcePath: `admin/users/resend-temp-password/${id}`, // ✅ id in the URL
    queryKey: ["userRequests", "resend-password", id],
  });

  const resend = async () => {
    try {
      const response = await mutateAsync({});
      console.log(response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return {
    resend,
    isPending,
  };
};
