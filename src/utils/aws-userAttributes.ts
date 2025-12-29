import { useQuery } from "@tanstack/react-query";
import { fetchUserAttributes } from "@aws-amplify/auth";

export const useUserAttributes = () => {
  return useQuery({
    queryKey: ["cognito-user-attributes"],
    queryFn: async () => {
      return await fetchUserAttributes();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};
