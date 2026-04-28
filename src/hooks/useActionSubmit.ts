import { usePOST } from "@/utils/api";
import type { Resource } from "@/utils/api";

type UseActionSubmitOptions<TPayload> = {
  id: string;
  resourcePath: Resource;
  queryKey: readonly unknown[];
  action: "approve" | "reject" | "action";
  payload: TPayload; // static — known at setup time
  onSuccess?: () => void;
  onError: (err: unknown) => void;
};

/**
 * Custom hook for handling predefined POST-based actions (e.g. approve, reject)
 * against a specific resource with a fixed payload.
 *
 * Wraps the `usePOST` hook to provide a simplified `submit` function that:
 * - Executes the mutation with a pre-configured payload
 * - Handles success and error flows
 * - Exposes a loading state for UI feedback
 *
 * The payload and resource identifiers are closed over at hook initialization,
 * meaning `submit` does not require any arguments when called.
 *
 * Features:
 * - Centralized mutation logic for action-based endpoints
 * - Built-in error logging with contextual information
 * - Optional success callback
 * - Required error handler for consistent error management
 * - Loading state (`isPending`) for UI control (e.g. disabling buttons, showing spinners)
 *
 * @template TPayload - Type of the payload sent in the POST request
 *
 * @param id - Identifier of the resource being acted upon
 * @param resourcePath - API resource path (e.g. "jobs", "users")
 * @param queryKey - React Query key used for cache invalidation/refetching
 * @param action - Action type to perform ("approve" | "reject" | "action")
 * @param payload - Static payload sent with the request (defined at hook setup)
 * @param onSuccess - Optional callback executed after a successful mutation
 * @param onError - Callback executed when the mutation fails
 *
 * @returns
 * - submit: Function to trigger the action (no arguments required)
 * - isPending: Boolean indicating whether the mutation is in progress
 *
 * @example
 * const { submit, isPending } = useActionSubmit({
 *   id: "123",
 *   resourcePath: "jobs",
 *   queryKey: ["jobs"],
 *   action: "approve",
 *   payload: { approved: true },
 *   onSuccess: () => toast.success("Job approved"),
 *   onError: (err) => toast.error("Something went wrong"),
 * });
 *
 * // usage
 * <Button onClick={submit} disabled={isPending}>
 *   {isPending ? "Processing..." : "Approve"}
 * </Button>
 */

export const useActionSubmit = <TPayload>({
  id,
  resourcePath,
  queryKey,
  action,
  payload,
  onSuccess,
  onError,
}: UseActionSubmitOptions<TPayload>) => {
  const { mutateAsync, isPending } = usePOST<TPayload, unknown>({
    id,
    resourcePath,
    queryKey,
    action,
  });

  const submit = async (): Promise<void> => {
    // no arguments — id and payload are closed over
    try {
      await mutateAsync(payload);
      onSuccess?.();
    } catch (err) {
      console.error(
        `[useActionSubmit] ${action} on "${resourcePath}/${id}" failed:`,
        err,
      );
      onError(err);
    }
  };

  return { submit, isPending };
};
