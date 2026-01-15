import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

// $ Types
import type {
  AssetFormValues,
  CreateAssetPayload,
  CreateJobFormValues,
  CreateJobPayload,
  PresignedUrlResponse,
} from "@/schemas";

export type Resource = "asset" | "maintenance-request" | "maintenance-list";

// $ Combine the types into a union type for the generic functions
export type EntityType = AssetFormValues | CreateJobFormValues;

// $ Format the data according to API requirements
// const formatData = <T extends EntityType>(item: T): Omit<T, "id"> => {
//   return item;
// };

// console.log(formatData);

// $ =========================
// $ Query Keys
// $ =========================
const MAINTENANCE_REQUESTS_KEY = ["maintenanceRequests"];
const ASSETS_REQUESTS_KEY = ["assetRequests"];

// $ =========================
// $ Hooks
// $ =========================

// $ Generic: GET All
export const useGetAll = <T extends EntityType>(
  resourcePath: Resource,
  queryKey: readonly unknown[] = [resourcePath]
) => {
  return useQuery<T[]>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/${resourcePath}`);
        return response.data as T[];
      } catch (error) {
        console.error(`Error fetching ${resourcePath}:`, error);
        throw error;
      }
    },
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
      const { data } = await apiClient.get<T & WithImages>(`${endpoint}/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// $ Generic: DELETE
export const useDeleteItem = (options: {
  resourcePath: Resource;
  queryKey: readonly unknown[];
}) => {
  const queryClient = useQueryClient();
  const { resourcePath, queryKey } = options;

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`${resourcePath}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

// % ========================================================================

export const useMaintenanceRequests = () => {
  return useQuery<CreateJobFormValues[]>({
    queryKey: MAINTENANCE_REQUESTS_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<CreateJobFormValues[]>(
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
      const { data } = await apiClient.get<AssetFormValues[]>("/asset");
      return data;
    },
  });
};

// $ GET by ID
export const useMaintenanceRequestById = (id: string) => {
  return useQuery<CreateJobFormValues>({
    queryKey: [...MAINTENANCE_REQUESTS_KEY, id],
    queryFn: async () => {
      const { data } = await apiClient.get<CreateJobFormValues>(
        `/maintenance-request/${id}`
      );
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
      const { data } = await apiClient.post("/maintenance-request", payload, {
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
      const { data } = await apiClient.post("/asset", payload, {
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
      const { data } = await apiClient.put<CreateJobFormValues>(
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

// $ UPDATE ITEM
type UpdateArgs<TPayload> = {
  id: string;
  payload: TPayload;
};

export const useUpdateItem = <TPayload, TResponse>({
  endpoint,
  queryKey,
}: {
  endpoint: string;
  queryKey: readonly unknown[];
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateArgs<TPayload>) => {
      const { data } = await apiClient.put<TResponse>(
        `/${endpoint}/${id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
