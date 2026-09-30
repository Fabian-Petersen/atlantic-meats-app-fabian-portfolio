import { useQuery } from "@tanstack/react-query";
import { fetchUserAttributes } from "@aws-amplify/auth";

export const useUserAttributes = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["cognito-user-attributes"],
    queryFn: async () => {
      return await fetchUserAttributes();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    enabled: options?.enabled ?? true,
  });
};
