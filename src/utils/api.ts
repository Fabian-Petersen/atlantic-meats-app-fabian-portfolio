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
  | "api/jobs" // parent route
  | "api/jobs/requests" // "POST: Job request" | "GET: All jobs enum["pending", "approved", "in-progress", "completed"]"
  | "api/jobs/actioned" // "GET: All actions enum["technicians", "contractors"]"
  | "api/jobs/completed"
  | `api/jobs/${string}/approve` // POST: Approve a pending job
  | `api/jobs/${string}/reject` // POST: Reject a pending job
  | `api/jobs/${string}/action` // POST: Job action by technician or contractor
  | `api/jobs/${string}` // GET, PUT, DELETE a single job by id enum["pending", "approved", "in-progress", "complete", "actioned"]
  | "api/jobs/approved" //"jobs-list-approved" : GET all approved requests
  | `api/jobs/${string}/jobcard` // GET: Download jobcard from backend
  // $ Assets ROUTES
  | "api/assets" // "assets-list" GET all assets assets/{assetId} to DELETE, PUT, GET assetById
  | "api/assets/location" // NOT in use : Get all assets by location
  | `api/assets/${string}/history`
  | `api/assets/${string}/history/metrics` // GET, asset history metrics
  | `api/assets/${string}/verify`
  | `api/assets/${string}/transfer`
  // $ Users ROUTES
  | "api/users/get-current-user" // Get user details by id
  | "api/users" // "admin/users" GET all users
  | "api/users/technicians" // "technician-list" Get the list of technicians
  | "api/users/contractors" // Not in use: Get the list of technicians
  // $ Users ROUTES
  | "api/comments" // POST a comment
  // api/$ admin ROUTES
  | "api/admin/confirm-user-signup" // handle the user status update after initial login. Trigger PostConfirmationTrigger lambda
  | `api/admin/resend-temp-password/${string}`
  | `api/admin/${string}`
  // $ Transfers ROUTES
  | "api/transfers" // "POST: Transfer request" | "GET: All transfers"
  | `api/transfers/${string}` // "GET: Transfer request"
  | "api/transfers/requests" // "POST: Job request" | "GET: All jobs enum["pending", "approved",
  | `api/transfers/${string}/approve` // "POST: status === `approve`
  | `api/transfers/${string}/reject` // "POST: status === `reject`
  | `api/transfers/${string}/in-transit` // "POST: status === `in-transit`
  | `api/transfers/${string}/receipt` // "POST: status === `receipt`
  | `api/transfers/${string}/cancel` // "POST: status === `cancel`
  | `api/transfers/metrics` // "GET: Dashboard metrics for transfer requests"
  | `api/transfers/my-transfers` // "GET: Transfers by user sub"

  // $ Stocks ROUTES
  | "api/stocks/create-new-stock" // "stocks-list" GET all stocks
  | `api/stocks/${string}` // GET, PUT, DELETE a single stock by id
  | "api/dashboard/metrics/jobs" // GET, the metrics data for jobs from the backend
  | "api/dashboard/metrics/charts"; // GET, the metrics data for store job charts from the backend

// $ Frontend Routing Paths (for redirection after actions)
export type RedirectResource =
  | "dashboard" // Main dashboard page with summary cards and charts
  | "jobs/create-job" // Page with the form to create a new maintenance request
  | "jobs/pending-approval" // Page showing all pending approval jobs
  | `jobs/${string}/pending-approval` // Page showing the details of a pending approval job by id
  | "jobs/in-progress" // Page showing all the in progress jobs
  | `jobs/${string}/in-progress` // Get the details of an in-progress job by id
  | "jobs/completed" // Page showing all completed jobs
  | `jobs/${string}/complete` // Page showing the details of a completed job by id
  | `jobs/${string}/action` // Page for actioning a job by id (technician/contractor)
  | "assets/create-new-asset" // Page with the form to create a new asset
  | "assets/list" // Page showing all assets
  | `assets/${string}` // Page showing the details of an asset by id
  | `assets/${string}/history` // Page showing the history of an asset by id
  | "users" // Page showing the list of all users (admin only)
  | "users/profile" // Page showing details of a user meta data
  | "stocks/create-new-stock" // Page with the form to create a new stock item
  | "stocks/list" // Page showing all stock items
  | `stocks/${string}` // Page showing the details of a stock item by id
  | "transfers/in-transit" // List of All transfer requests by group (admin: All, users: CreatedBySub)
  | `/transfers/${string}/in-transit` // "POST: status === `in-transit`
  | "transfers/requests" // List of all pending, approved and rejected transfer requests
  | "transfers/list"; // List of All transfer requests by group (admin: All, users: CreatedBySub)

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
  params?: Record<
    string,
    string | number | boolean | string[] | null | undefined
  >;
  enabled?: boolean;
}) => {
  const { resourcePath, queryKey, params, enabled } = options;

  return useQuery({
    queryKey,
    enabled: enabled ?? true,
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
  action?: "approve" | "reject" | "action" | "verify";
}) => {
  const queryClient = useQueryClient();
  const { resourcePath, queryKey } = options;

  return useMutation({
    mutationFn: async (payload: RequestType): Promise<ResponseType> => {
      /**
       * Dynamically build the url to prevent errors and ensure consistency. The URL structure is based on the resourcePath and optional id and action parameters.
       * Examples:
       * - For a simple POST to create a new job request: resourcePath="jobs/requests" -> URL: "/jobs/requests"
       * - For approving a job request: resourcePath="jobs", id="123", action="approve" -> URL: "/jobs/123/approve"
       * - For actioning a job by a technician: resourcePath="jobs", id="123", action="action" -> URL: "/jobs/123/action"
       * - For rejecting a job request: resourcePath="jobs", id="123", action="reject" -> URL: "/jobs/123/reject"
       * This approach centralizes the URL construction logic, reduces the risk of typos, and makes it easier to maintain as the API evolves.
       */
      const pathParts = [resourcePath, options.id, options.action].filter(
        Boolean,
      );

      const url = `/${pathParts.join("/")}`;
      const { data } = await apiClient.post<ResponseType>(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
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

export const useDownloadPdf = (options: { resourcePath: Resource }) => {
  const { resourcePath } = options;

  return useMutation({
    mutationFn: async (id: string): Promise<JobcardPresignedUrlResponse> => {
      const { data } = await apiClient.get<JobcardPresignedUrlResponse>(
        `/${resourcePath}/${id}/jobcard`,
      );
      return data;
    },

    onSuccess: (data) => {
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
