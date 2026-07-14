import type { TransferWorkflowResponse, TransferStatus } from "@/schemas";

/**
 * Flattens one or more workflow stages into the root transfer object.
 *
 * This utility is intended for table components that require fields from
 * nested workflow stages to be available as top-level properties for
 * filtering, sorting and rendering.
 *
 * Stages are merged in the order provided. If two stages contain the same
 * property name, the value from the later stage will overwrite the earlier
 * one.
 *
 * @param transfers - Array of transfer workflow objects returned by the API.
 * @param stages - Workflow stages to flatten into each transfer.
 *
 * @returns A new array of flattened transfer objects.
 *
 * @example
 * // Pending/Approved Requests table
 * const rows = flattenTransfers(data, ["pending", "approved"]);
 *
 * @example
 * // In Transit table
 * const rows = flattenTransfers(data, [
 *   "pending",
 *   "approved",
 *   "in-transit",
 * ]);
 *
 * @example
 * // Receipted table
 * const rows = flattenTransfers(data, [
 *   "pending",
 *   "approved",
 *   "in-transit",
 *   "receipt",
 * ]);
 *
 * @example
 * // Full workflow (all stages)
 * const rows = flattenTransfers(data);
 */
export const flattenTransfersData = (
  transfers: TransferWorkflowResponse[] = [],
  stages: TransferStatus[] = [
    "pending",
    "approved",
    "cancelled",
    "in-transit",
    "rejected",
    "completed",
  ],
) =>
  transfers.map((transfer) => ({
    ...transfer,
    ...Object.assign({}, ...stages.map((stage) => transfer[stage] ?? {})),
  }));
