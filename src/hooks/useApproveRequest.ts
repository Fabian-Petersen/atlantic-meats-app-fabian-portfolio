import useGlobalContext from "@/context/useGlobalContext";
import { useFormSubmit } from "@/hooks/useFormSubmit";

import type { Resource, RedirectResource } from "@/utils/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type UseApproveRequestOptions = {
  /** The id of the item being approved. */
  id: string;
  /** The API route to POST to. */
  resourcePath: Resource;

  /** React-Query cache key(s) to invalidate on success. */
  queryKey: readonly unknown[];

  /** Message shown in the Success modal after a successful approval. */
  successMessage: string;
  /** Message shown in the Error modal if the approval fails. */
  errorMessage: string;
  /** Optional redirect path used by both the Success and Error configs. */
  redirectPath?: RedirectResource;

  /**
   * Called once the request settles, before the Success/Error modal is
   * shown — regardless of outcome. Use this to close a dialog the approve
   * action was triggered from.
   *
   * Not called on API pages where approval isn't happening inside a modal
   * (e.g. `TransferRequestApproval`) — just omit it.
   *
   * @example
   * onSettled: () => setShowApproveDialog(false)
   */
  onSettled?: () => void;
};

// $ ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Generic approve-action hook.
 *
 * Thin wrapper around `useFormSubmit` for the common "approve this item"
 * case: no form fields, no images — just `{ id, status: "approved" }` sent
 * to the backend. Also owns the Success/Error modal wiring via
 * `useGlobalContext`, so callers don't have to repeat that boilerplate in
 * every approval page or dialog.
 *
 * If the approval ever needs additional fields beyond `id`/`status` (e.g. an
 * approval note), don't bolt them onto this hook — that's a `useFormSubmit`
 * call with a real form, same pattern as `RejectRequestDialog`.
 *
 * ── Payload ──────────────────────────────────────────────────────────────
 *   Always `{ id, status: "approved" }`. The hook ignores whatever is
 *   passed to `submit()` — call it with `submit({})` since `useFormSubmit`
 *   expects an object argument even though this hook has no form values.
 *
 * ── Callbacks ──────────────────────────────────────────────────────────────
 * `onSettled` — optional, fires before the Success/Error modal on both
 *               outcomes. Use it to close a dialog. Omit for standalone
 *               approval pages that aren't inside a modal.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *
 * @example
 * // $ Standalone approval page, no dialog to close (e.g. TransferRequestApproval)
 * const { submit: approveRequest, isPending: isApproving } = useApproveRequest({
 *   id: selectedRowId ?? "",
 *   resourcePath: "api/transfers",
 *   queryKey: ["transfers", "action: approve-item"],
 *   successMessage: "The Request was Successfully Approved!!!",
 *   errorMessage: "Could not approve the asset transfer. Please try again.",
 *   redirectPath: "transfers/requests",
 * });
 *
 * const handleApprove = async () => {
 *   try {
 *     await approveRequest({});
 *     toast.success("The asset transfer was approved successfully.");
 *   } catch (error) {
 *     if (axios.isAxiosError<{ message: string }>(error)) {
 *       toast.error(error?.response?.data?.message);
 *     } else {
 *       toast.error("Failed to assign item");
 *     }
 *   }
 * };
 *
 * @example
 * // Approval triggered from inside a modal (e.g. ApproveJobDialog)
 * const { submit: approveJob, isPending } = useApproveRequest({
 *   id: job.id,
 *   resourcePath: "jobs/requests",
 *   queryKey: ["jobs"],
 *   successMessage: `Request ${job.id} has been approved.`,
 *   errorMessage: "Could not approve the job. Please try again.",
 *   redirectPath: "jobs/approved",
 *   onSettled: () => setShowApproveDialog(false),
 * });
 *
 * <button disabled={isPending} onClick={() => approveJob({})}>
 *   Confirm Approve
 * </button>
 */

export function useApproveRequest({
  id,
  resourcePath,
  queryKey,
  successMessage,
  errorMessage,
  redirectPath,
  onSettled,
}: UseApproveRequestOptions) {
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();

  return useFormSubmit({
    id,
    resourcePath,
    queryKey,
    action: "approve",
    buildPayload: () => ({ id, status: "approved" }),
    onSuccess: () => {
      onSettled?.();
      setSuccessConfig({
        title: "Success",
        message: successMessage,
        redirectPath,
      });
      setShowSuccess(true);
    },
    onError: () => {
      onSettled?.();
      setErrorConfig({
        title: "Approval Failed",
        message: errorMessage,
        redirectPath,
      });
      setShowError(true);
    },
  });
}
