// $ This function request the user details from the database crud-nosql.app.users-table to be used inside the application

import { useGetAll } from "@/utils/api";
import type { UsersAPIResponse } from "@/schemas/usersSchema";

// $ Get the list of technicians from the database

export const useGetUser = () => {
  return useGetAll<UsersAPIResponse>({
    resourcePath: `users/get-current-user`,
    queryKey: ["users", "current-user"],
  });
};
