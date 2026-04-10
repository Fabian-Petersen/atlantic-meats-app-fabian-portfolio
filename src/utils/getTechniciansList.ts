import { useGetAll } from "@/utils/api";
import type { TechnicianOption } from "@/schemas/technicianSchemas";

// $ Get the list of technicians from the database

export const useGetTechnicians = () => {
  return useGetAll<TechnicianOption[]>({
    resourcePath: "users/technicians",
    queryKey: ["technicians"],
  });
};
