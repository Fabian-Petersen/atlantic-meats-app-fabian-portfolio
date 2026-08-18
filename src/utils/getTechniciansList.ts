import { useGetAll } from "@/utils/api";
import type { TechnicianOption } from "@/schemas/technicianSchemas";

// $ Get the list of technicians from the database

export const useGetTechnicians = () => {
  const { data, isPending, isError } = useGetAll<TechnicianOption[]>({
    resourcePath: "api/users/technicians",
    queryKey: ["technicians"],
  });

  return { data, isPending, isError };
};
