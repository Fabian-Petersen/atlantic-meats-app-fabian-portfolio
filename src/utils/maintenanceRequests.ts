import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./apiClient";
import type {
  AssetFormValues,
  CreateAssetPayload,
  CreateJobFormValues,
  CreateJobPayload,
  PresignedUrlResponse,
} from "@/schemas";
// import { useNavigate } from "react-router-dom";

// $ =========================
// $ Query Keys
// $ =========================
const MAINTENANCE_REQUESTS_KEY = ["maintenanceRequests"];
const ASSETS_REQUESTS_KEY = ["assetRequests"];

// $ =========================
// $ Hooks
// $ =========================

// $ GET all
export const useMaintenanceRequests = () => {
  return useQuery<CreateJobFormValues[]>({
    queryKey: MAINTENANCE_REQUESTS_KEY,
    queryFn: async () => {
      const { data } = await api.get<CreateJobFormValues[]>(
        "/maintenance-request"
      );
      return data;
    },
  });
};

export const useAssetsList = () => {
  return useQuery<AssetFormValues[]>({
    queryKey: ASSETS_REQUESTS_KEY,
    queryFn: async () => {
      const { data } = await api.get<AssetFormValues[]>("/asset");
      return data;
    },
  });
};

// $ GET by ID
export const useMaintenanceRequestById = (id: string) => {
  return useQuery<CreateJobFormValues>({
    queryKey: [...MAINTENANCE_REQUESTS_KEY, id],
    queryFn: async () => {
      const { data } = await api.get<CreateJobFormValues>(
        `/maintenance-request/${id}`
      );
      return data;
    },
    enabled: !!id,
  });
};

type WithImages = {
  presignedURLs?: PresignedUrlResponse[];
};

// $ Generic: GET by ID
export const useById = <T>(options: {
  id: string;
  queryKey: readonly unknown[];
  endpoint: string;
}) => {
  const { id, queryKey, endpoint } = options;

  return useQuery<T & WithImages>({
    queryKey: [...queryKey, id],
    queryFn: async () => {
      const { data } = await api.get<T & WithImages>(`${endpoint}/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// $ CREATE
export const useCreateMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateJobPayload) => {
      const { data } = await api.post("/maintenance-request", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MAINTENANCE_REQUESTS_KEY,
      });
    },
  });
};

export const useCreateNewAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAssetPayload) => {
      const { data } = await api.post("/asset", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ASSETS_REQUESTS_KEY,
      });
    },
  });
};

// //$ Generic: POST new Item
// export const useCreateNewItem = <TResponse, TPayload>(options: {
//   queryKey: readonly unknown[];
//   endpoint: string;
//   redirect: string;
// }) => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   return useMutation<TResponse, Error, TPayload>({
//     mutationFn: async (payload: TPayload) => {
//       const { data } = await api.post<TResponse>(options.endpoint, payload);
//       return data;
//     },
//     onSuccess: () => {
//       navigate(options.redirect);
//       queryClient.invalidateQueries({
//         queryKey: options.queryKey,
//       });
//     },
//   });
// };

// $ UPDATE
export const useUpdateMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateJobFormValues>;
    }) => {
      const { data } = await api.put<CreateJobFormValues>(
        `/maintenance-request/${id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MAINTENANCE_REQUESTS_KEY,
      });
    },
  });
};

// $ DELETE
export const useDeleteMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/maintenance-request/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MAINTENANCE_REQUESTS_KEY,
      });
    },
  });
};
