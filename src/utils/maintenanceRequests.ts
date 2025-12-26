import { api } from "./apiClient";
// Types should match your Zod schema
import type { CreateJobFormValues } from "@/schemas";

// $ ========================== POST ======================= //
export const createMaintenanceRequest = async (
  payload: CreateJobFormValues
) => {
  const { data } = await api.post<CreateJobFormValues>(
    " /maintenance-request",
    payload
  );
  return data;
};

// $ ========================== GET ======================= //
export const getMaintenanceRequests = async () => {
  const { data } = await api.get<CreateJobFormValues[]>("/maintenance-request");
  return data;
};

// $ ========================== GET by ID ======================= //

export const getMaintenanceRequestById = async (id: string) => {
  const { data } = await api.get<CreateJobFormValues>(
    `/maintenance-request/${id}`
  );
  return data;
};

// $ ========================== UPDATE ======================= //
export const updateMaintenanceRequest = async (
  id: string,
  payload: Partial<CreateJobFormValues>
) => {
  const { data } = await api.put<CreateJobFormValues>(
    `/maintenance-request/${id}`,
    payload
  );
  return data;
};

// $ ========================== DELETE ======================= //
export const deleteMaintenanceRequest = async (id: string) => {
  await api.delete(`/maintenance-request/${id}`);
};
