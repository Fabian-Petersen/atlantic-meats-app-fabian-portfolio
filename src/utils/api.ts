import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

// $ Types
import type {
  AssetRequestFormValues,
  CreateAssetPayload,
  JobRequestFormValues,
  CreateJobPayload,
  PresignedUrlResponse,
  JobcardPresignedUrlResponse,
  ActionRequestPayload,
  AssetAPIResponse,
  JobAPIResponse,
  ActionAPIResponse,
  UsersAPIResponse,
  // PresignedURL,
} from "@/schemas";
import type { CommentRequestFormValues } from "@/schemas/commentSchemas";

export type Resource =
  | "asset" // POST & DELETE, PUT, GET assetById
  | "assets-list" // GET all assets
  | "maintenance-action" // POST & DELETE, GET
  | "maintenance-actions-list" // GET all actions
  | "maintenance-jobcard" // GET jobcardById
  | "maintenance-request" // POST & DELETE, GET requestsById
  | "jobs-list" // GET all maintenance requests
  | "jobs-list-pending" // GET all pending approval requests
  | "jobs-list-approved" // GET all approved requests
  | "comment" // POST a comment
  | "technician-list" // Get the list of technicians
  | "job-request-rejected"
  | "job-request-approved"
  | "admin/users"
  | `admin/users/resend-temp-password/${string}`
  | "admin/users/confirm_user_signup" // handle the user status update after initial login. Trigger PostConfirmationTrigger lambda
  | `admin/users/${string}`
  | "admin/user"; // Get user details by id

// $ Combine the types into a union type for the generic functions
export type RequestType =
  | AssetRequestFormValues
  | JobRequestFormValues
  | CommentRequestFormValues
  | AssetAPIResponse;

export type ResponseType =
  | AssetAPIResponse
  | JobAPIResponse
  | ActionAPIResponse
  | PresignedUrlResponse
  | UsersAPIResponse;

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
// const USERS = ["userRequests"];
// const ACTION_REQUESTS_KEY = ["actionRequests"];
// const POST_COMMENT = ["CommentsKey"];
// const POST_KEYS = ["commentsRequests"];

// $ =========================
// $ Hooks
// $ =========================

// $ Generic: GET All
export const useGetAll = <ResponseType>(
  options: {
    resourcePath: Resource;
    queryKey: readonly unknown[];
  },
  // enabled: boolean = true,
) => {
  const { resourcePath, queryKey } = options;
  return useQuery({
    queryKey,
    queryFn: async (): Promise<ResponseType> => {
      try {
        const response = await apiClient.get<ResponseType>(`/${resourcePath}`);
        return response.data as ResponseType;
      } catch (error) {
        console.error(`Error fetching ${resourcePath}:`, error);
        throw error;
      }
    },
    // enabled: enabled && !!resourcePath,
  });
};

// $ Generic: GET by ID
export const useById = <ResponseType>(options: {
  id: string;
  queryKey: readonly unknown[];
  resourcePath: Resource;
}) => {
  // console.log("🔥 useById called with options:", options);
  const { id, queryKey, resourcePath } = options;
  return useQuery<ResponseType>({
    queryKey: [...queryKey, id],
    queryFn: async (): Promise<ResponseType> => {
      const { data } = await apiClient.get<ResponseType>(
        `/${resourcePath}/${id}`,
      );
      return data;
    },
    enabled: !!id,
  });
};

// $ Generic: POST
export const usePOST = <RequestType, ResponseType>(options: {
  resourcePath: Resource;
  queryKey: readonly unknown[];
}) => {
  const queryClient = useQueryClient();
  const { resourcePath, queryKey } = options;

  return useMutation({
    mutationFn: async (payload: RequestType): Promise<ResponseType> => {
      const { data } = await apiClient.post<ResponseType>(
        `${resourcePath}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      return data;
    },
    onSuccess: () => {
      // queryKey must be the same as the queryKey for the GET function
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
    },
  });
};

// $ Generic: UPDATE/PUT
type UpdateArgs<TPayload> = {
  id: string;
  payload: TPayload;
};

export const useUpdateItem = <TPayload, TResponse>({
  resourcePath,
  queryKey,
}: {
  resourcePath: string;
  queryKey: readonly unknown[];
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: UpdateArgs<TPayload>): Promise<TResponse> => {
      // console.log("request_id:", id);
      // console.log("resource_path:", resourcePath);
      const { data } = await apiClient.put<TResponse>(
        `/${resourcePath}/${id}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
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

// $ Download maintenance jobcard pdf
// type JobcardPresignedUrlResponse = {
//   jobcard_url: string;
// };

export const useDownloadPdf = (options: { resourcePath: Resource }) => {
  const { resourcePath } = options;

  return useMutation({
    mutationFn: async (id: string): Promise<JobcardPresignedUrlResponse> => {
      const { data } = await apiClient.get<JobcardPresignedUrlResponse>(
        `${resourcePath}/${id}`,
      );
      return data;
    },

    onSuccess: (data) => {
      // console.log("jobcard_url:", jobcard_url);
      // $ Option 1: trigger a download in the same tab
      window.location.href = data.jobcard_url;

      // $ Option 2 (alternative): open in new tab
      // window.open(jobcard_url, "_blank", "noopener,noreferrer");
    },
  });
};

//  await queryClient.invalidateQueries({ queryKey: COMMENTS_KEY });
// await queryClient.refetchQueries({ queryKey: COMMENTS_KEY, type: "active" });

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

export const useCreateActionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ActionRequestPayload) => {
      const { data } = await apiClient.post("/maintenance-action", payload, {
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

// $ UPDATE
export const useUpdateMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<JobRequestFormValues>;
    }) => {
      const { data } = await apiClient.put<JobRequestFormValues>(
        `/maintenance-request/${id}`,
        payload,
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

// % ========================================================================

export const useMaintenanceRequests = () => {
  return useQuery<JobRequestFormValues[]>({
    queryKey: MAINTENANCE_REQUESTS_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<JobRequestFormValues[]>(
        "/maintenance-request",
      );
      return data;
    },
  });
};

export const useAssetsList = () => {
  return useQuery<AssetRequestFormValues[]>({
    queryKey: ASSETS_REQUESTS_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<AssetRequestFormValues[]>("/asset");
      return data;
    },
  });
};

// $ GET by ID
export const useMaintenanceRequestById = (id: string) => {
  return useQuery<JobRequestFormValues>({
    queryKey: [...MAINTENANCE_REQUESTS_KEY, id],
    queryFn: async () => {
      const { data } = await apiClient.get<JobRequestFormValues>(
        `/maintenance-request/${id}`,
      );
      return data;
    },
    enabled: !!id,
  });
};
