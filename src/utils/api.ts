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

// $ Backend Routing Paths
export type Resource =
  // $Jobs ROUTES
  | "jobs" // parent route
  | "jobs/requests" // "POST: Job request" | "GET: All jobs enum["pending", "approved", "in-progress", "completed"]"
  | "jobs/actioned" // "GET: All actions enum["technicians", "contractors"]"
  | `jobs/${string}/approve` // POST: Approve a pending job
  | `jobs/${string}/reject` // POST: Reject a pending job
  | `jobs/${string}/action` // POST: Job action by technician or contractor
  | `jobs/${string}` // GET, PUT, DELETE a single job by id enum["pending", "approved", "in-progress", "completed", "actioned"]
  | "jobs/approved" //"jobs-list-approved" : GET all approved requests
  | `jobs/${string}/jobcard` // GET: Download jobcard from backend
  // $ Assets ROUTES
  | "assets-data" // "assets-list" GET all assets assets/{assetId} to DELETE, PUT, GET assetById
  | "assets-data/location" // NOT in use : Get all assets by location
  // $ Users ROUTES
  | "users/get-current-user" // Get user details by id
  | "users" // "admin/users" GET all users
  | "users/technicians" // "technician-list" Get the list of technicians
  | "users/contractors" // Not in use: Get the list of technicians
  // $ Users ROUTES
  | "comments" // POST a comment
  // $ admin ROUTES
  | "admin/confirm_user_signup" // handle the user status update after initial login. Trigger PostConfirmationTrigger lambda
  | `admin/resend-temp-password/${string}`
  | `admin/${string}`;

// $ Frontend Routing Paths (for redirection after actions)
export type RedirectResource =
  | "dashboard" // Main dashboard page with summary cards and charts
  | "jobs/create-job" // Page with the form to create a new maintenance request
  | "jobs/pending-approval" // Page showing all pending approval jobs
  | `jobs/${string}/pending-approval` // Page showing the details of a pending approval job by id
  | "jobs/in-progress" // Page showing al the in progress jobs
  | `jobs/${string}/in-progress` // Get the details of an in-progress job by id
  | "jobs/completed" // Page showing all completed jobs
  | `jobs/${string}/completed` // Page showing the details of a completed job by id
  | `jobs/${string}/action` // Page for actioning a job by id (technician/contractor)
  | "assets/create-new-asset" // Page with the form to create a new asset
  | "assets/list" // Page showing all assets
  | `assets/${string}` // Page showing the details of an asset by id
  | "users" // Page showing the list of all users (admin only)
  | "users/profile"; // Page showing details of a user meta data

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
const MAINTENANCE_REQUESTS_KEY = ["jobs"];
const ASSETS_REQUESTS_KEY = ["assets", "asset"];
// const USERS = ["users"];
// const ACTION_REQUESTS_KEY = ["actionJob"];
// const POST_COMMENT = ["CommentsKey"];
// const POST_KEYS = ["commentsRequests"];

// $ =========================
// $ Hooks
// $ =========================

// $ Generic: GET with query params (e.g., filter by location)
export const useGetAll = <ResponseType>(options: {
  resourcePath: Resource;
  queryKey: readonly unknown[];
  params?: Record<string, string | number | boolean>;
}) => {
  const { resourcePath, queryKey, params } = options;

  return useQuery({
    queryKey,
    queryFn: async (): Promise<ResponseType> => {
      try {
        const response = await apiClient.get<ResponseType>(`/${resourcePath}`, {
          params,
        });

        return response.data as ResponseType;
      } catch (error) {
        console.error(`Error fetching ${resourcePath}:`, error);
        throw error;
      }
    },
  });
};

// $ Generic: GET All without query params
// export const useGetAll = <ResponseType>(
//   options: {
//     resourcePath: Resource;
//     queryKey: readonly unknown[];
//   },
//   // enabled: boolean = true,
// ) => {
//   const { resourcePath, queryKey } = options;
//   return useQuery({
//     queryKey,
//     queryFn: async (): Promise<ResponseType> => {
//       try {
//         const response = await apiClient.get<ResponseType>(`/${resourcePath}`);
//         return response.data as ResponseType;
//       } catch (error) {
//         console.error(`Error fetching ${resourcePath}:`, error);
//         throw error;
//       }
//     },
//     // enabled: enabled && !!resourcePath,
//   });
// };

// $ Generic: GET by ID
export const useById = <ResponseType>(options: {
  id: string;
  queryKey: readonly unknown[];
  resourcePath: Resource;
  params?: Record<string, string | number | boolean>;
}) => {
  // console.log("🔥 useById called with options:", options);
  const { id, queryKey, resourcePath, params } = options;
  return useQuery<ResponseType>({
    queryKey: [...queryKey, id],
    queryFn: async (): Promise<ResponseType> => {
      const { data } = await apiClient.get<ResponseType>(
        `/${resourcePath}/${id}`,
        { params },
      );
      return data;
    },
    enabled: !!id,
  });
};

// $ Generic: POST
export const usePOST = <RequestType, ResponseType>(options: {
  id?: string;
  resourcePath: Resource;
  queryKey: readonly unknown[];
  action?: "approve" | "reject" | "action";
}) => {
  const queryClient = useQueryClient();
  const { resourcePath, queryKey } = options;

  return useMutation({
    mutationFn: async (payload: RequestType): Promise<ResponseType> => {
      const { data } = await apiClient.post<ResponseType>(
        `/${resourcePath}/${options.id ?? ""}/${options.action ?? ""}`,
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
      await apiClient.delete(`/${resourcePath}/${id}`);
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
        `/${resourcePath}/${id}`,
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
      const { data } = await apiClient.post("/assets", payload, {
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
