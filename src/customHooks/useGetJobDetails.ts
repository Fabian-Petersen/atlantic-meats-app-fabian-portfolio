// $ Get the job details from the database using the selectedRowId to get the jobcard number and asset details to display on the form (optional)
import { useById } from "@/utils/api";
import { type JobAPIResponse } from "../schemas/index";

export const useGetJobDetails = (selectedRowId: string) => {
  const { data: jobData } = useById<JobAPIResponse>({
    id: selectedRowId!,
    queryKey: ["maintenanceJob", selectedRowId],
    endpoint: "/maintenance-request",
  });

  return { jobData };
};
