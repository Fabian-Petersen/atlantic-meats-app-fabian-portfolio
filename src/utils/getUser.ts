// $ This function request the user details from the database crud-nosql.app.users-table to be used inside the application

import { useGetAll } from "@/utils/api";
import type { UsersAPIResponse } from "@/schemas/usersSchema";

export const useGetUser = () => {
  return useGetAll<UsersAPIResponse>({
    resourcePath: `api/users/get-current-user`,
    queryKey: ["users", "current-user"],
  });
};
