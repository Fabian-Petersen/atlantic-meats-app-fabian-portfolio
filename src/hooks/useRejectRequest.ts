import useGlobalContext from "@/context/useGlobalContext";
import { useFormSubmit } from "@/hooks/useFormSubmit";

import type { Resource, RedirectResource } from "@/utils/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type RejectFormValues = {
  reason: string;
  [key: string]: unknown;
};

type UseRejectRequestOptions = {
  /** The id of the item being rejected. */
  id: string;
  /** The API route to POST to. */
  resourcePath: Resource;

  /** React-Query cache key(s) to invalidate on success. */
  queryKey: readonly unknown[];

  /** Message shown in the Success modal after a successful rejection. */
  successMessage: string;
  /** Message shown in the Error modal if the rejection fails. */
  errorMessage: string;
  /** Optional redirect path used by both the Success and Error configs. */
  redirectPath: RedirectResource;

  /**
   * The backend field name for the rejection reason. Defaults to
   * `"reason"`. Domains that expect a different key (e.g. jobs currently
   * expects `reject_message`) can override this without the form needing
   * to know or care — the form always works with `reason` internally.
   *
   * @example payloadKey: "reject_message" // jobs
   * @example payloadKey: "transferReason" // transfers
   */
  payloadKey?: string;

  /**
   * Called once the request settles, before the Success/Error modal is
   * shown — regardless of outcome. Use this to close the reject dialog.
   *
   * @example
   * onSettled: () => setShowRejectRequestDialog(false)
   */
  onSettled?: () => void;
};

// $ ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Generic reject-action hook.
 *
 * Sibling to `useApproveRequest` — same wrapper-around-`useFormSubmit`
 * shape, same Success/Error modal wiring via `useGlobalContext`. The one
 * difference: rejection requires a `reason`, so unlike approve, `submit()`
 * takes real form values instead of an empty object.
 *
 * This hook is meant to be called from inside the form that collects the
 * reason (e.g. `RejectRequestFormGeneric`), not from the dialog shell that
 * renders it — the dialog (`RejectRequestDialogGeneric`) only owns
 * title/message copy and open state, it has no submission logic.
 *
 * ── Payload ──────────────────────────────────────────────────────────────
 *   Always `{ id, status: "rejected", [payloadKey]: reason }`. The form
 *   always works with a `reason` field internally; `payloadKey` (default
 *   `"reason"`) controls what key it's sent under, since backend field
 *   names for the rejection reason aren't consistent across domains.
 *   Validate the reason is non-empty in the form before calling submit —
 *   this hook doesn't guard against blank reasons itself.
 *
 * ── Callbacks ──────────────────────────────────────────────────────────────
 * `onSettled` — optional, fires before the Success/Error modal on both
 *               outcomes. Use it to close the reject dialog.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *
 * @example
 * // $ Used inside RejectRequestFormGeneric, config supplied via rejectConfig context
 * const { submit: rejectRequest, isPending } = useRejectRequest({
 *   id: selectedRowId ?? "",
 *   resourcePath: rejectConfig.resourcePath,
 *   queryKey: rejectConfig.queryKey,
 *   successMessage: rejectConfig.successMessage,
 *   errorMessage: rejectConfig.errorMessage,
 *   redirectPath: rejectConfig.redirectPath,
 *   payloadKey: rejectConfig.payloadKey,
 *   onSettled: () => setShowRejectRequestDialog(false),
 * });
 *
 * const onSubmit = (data: RejectRequestFormValues) => {
 *   rejectRequest(data); // { reason: "..." }
 *   reset();
 * };
 *
 * @example
 * // Jobs caller — reason sent to the backend as "reject_message"
 * setRejectConfig({
 *   title: "Reject Request",
 *   message: "Are you sure you want to reject this item?",
 *   resourcePath: "jobs",
 *   queryKey: ["maintenanceRequests"],
 *   successMessage: "The Request was Rejected!!!",
 *   errorMessage: "Could not reject the request. Please try again.",
 *   redirectPath: "jobs/pending-approval",
 *   payloadKey: "reject_message",
 * });
 * setShowRejectRequestDialog(true);
 *
 * @example
 * // Transfers caller — reason sent to the backend as "reason" (default, omitted)
 * setRejectConfig({
 *   title: "Reject Transfer",
 *   message: "Are you sure you want to reject this transfer?",
 *   resourcePath: "api/transfers",
 *   queryKey: ["transfers", "action: reject-item"],
 *   successMessage: "The Request was Successfully Rejected.",
 *   errorMessage: "Could not reject the asset transfer. Please try again.",
 *   redirectPath: "transfers/requests",
 * });
 * setShowRejectRequestDialog(true);
 */

export function useRejectRequest({
  id,
  resourcePath,
  queryKey,
  successMessage,
  errorMessage,
  redirectPath,
  payloadKey = "reason",
  onSettled,
}: UseRejectRequestOptions) {
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();

  return useFormSubmit<RejectFormValues, unknown>({
    id,
    resourcePath,
    queryKey,
    action: "reject",
    buildPayload: (values) => ({
      id,
      status: "rejected",
      [payloadKey]: values.reason,
    }),
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
        title: "Rejection Failed",
        message: errorMessage,
        redirectPath,
      });
      setShowError(true);
    },
  });
}
