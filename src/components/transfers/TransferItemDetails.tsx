import { useEffect, useState } from "react";
import Separator from "@/components/dashboardSidebar/Seperator";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { cn } from "@/lib/utils";
import { ImageGallery } from "../features/ImageGallery";
import type { TransferWorkflowResponse } from "@/schemas/transfersSchemas";
// import type { PresignedUrls } from "@/schemas/jobSchemas";
import { Link } from "react-router-dom";

// $ ————— Feature Components ——————————————————————————————————————————————————————
import SectionTitle from "../features/layout/SectionTitle";
import Field from "../features/layout/Field";
import DescriptionBox from "../features/layout/DescriptionBox";
// import CostCard from "../features/layout/CostCard";
import PersonRow from "../features/layout/PersonRow";

// $ ————— config ——————————————————————————————————————————————————————————————————
import { TAB_CONFIG, type Tab } from "@/lib/transferTabConfig";

// $ ————— utils ——————————————————————————————————————————————————————————————————
import { formatDateTime } from "@/utils/formatDateTime";
import { MessageSquare } from "lucide-react";
import useGlobalContext from "@/context/useGlobalContext";

// ── Types ────────────────────────────────────────────────────────────────────

type Props = {
  item: TransferWorkflowResponse;
};

// A generic image/document shape used for gallery + attachment rendering.
// NOTE: `request.images` type comes from `assetRequestSchema` (not shown here) — if it
// isn't a presigned URL array (`{ url, filename }[]`), swap the mapping in the

// $ ── Main component ────────────────────────────────────────────────────────────
/**
 * TransferItemDetails
 *
 * Renders a desktop-optimized view of an asset transfer, following its
 * lifecycle: request (+ approval) → in-transit → received → costs.
 *
 * The workflow response (`TransferWorkflowResponse`) bundles all stages
 * together, but a transfer only *has* data for the stages it has actually
 * reached — e.g. a PENDING transfer has `request` only, while a RECEIVED
 * transfer has request, approval, in-transit, and receipt data. Tabs from
 * `TAB_CONFIG` are hidden when their underlying stage data isn't present:
 * - "request"    always shown
 * - "in-transit" shown if the transfer has been approved and/or dispatched
 * - "received"   shown once a receipt exists
 * - "costs"      shown once there's transport cost data to report
 *
 * @param item - Transfer workflow data from API
 */

function TransferItemDetails({ item }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("request");
  const { setOpenChatSidebar, setSelectedRowId } = useGlobalContext();

  const request = item.pending;
  const approved = item.approved;
  const inTransit = item["in-transit"];
  const completed = item.completed;

  const hasInTransitTab = !!approved || !!inTransit;
  const hasReceivedTab = !!completed;
  const hasCostsTab = !!inTransit;

  // Keep the active tab valid if the item changes (e.g. list navigation)
  // and a previously-active stage is no longer available.
  useEffect(() => {
    if (activeTab === "in-transit" && !hasInTransitTab) setActiveTab("request");
    if (activeTab === "received" && !hasReceivedTab) setActiveTab("request");
    if (activeTab === "costs" && !hasCostsTab) setActiveTab("request");
  }, [activeTab, hasInTransitTab, hasReceivedTab, hasCostsTab]);

  const isDamaged = completed?.condition === "damaged";

  return (
    <div
      className={cn(
        "flex-1 min-h-0 p-4",
        "h-auto hidden bg-(--bg-primary-light) border-gray-700/70 rounded-md text-gray-100",
        "md:grid grid-cols-[1fr_1fr] items-stretch gap-4",
        "dark:bg-(--bg-primary_dark) dark:text-gray-800 shadow-md",
      )}
    >
      {/* ── LEFT: Image panel ── */}
      <div className="h-full overflow-hidden object-cover gap-2">
        <ImageGallery
          images={
            activeTab === "in-transit"
              ? (inTransit?.images ?? [])
              : activeTab === "received"
                ? (completed?.images ?? [])
                : (request?.images ?? [])
          }
          className="p-0"
        />
      </div>

      {/* ── RIGHT: Detail panel ── */}
      <div
        className="relative flex flex-col flex-1 gap-4 text-font dark:text-gray-100 rounded-md p-4 border border-gray-100 dark:border-gray-700/50 min-h-0 overflow-y-auto 
      custom-scrollbar pr-1 dark:bg-(--bg-primary_dark)"
      >
        {/* Header */}
        <div className="flex flex-col gap-2 sticky">
          <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium select-none">
            Transfer · {item.id}
          </p>
          <div className="flex justify-between items-center">
            <h1 className="text-lg md:text-xl font-semibold capitalize leading-tight">
              {request?.equipment}
            </h1>
            <button
              type="button"
              aria-label="open chatbar"
              className="mr-4 text-blue-500 hover:cursor-pointer"
              onClick={() => {
                setSelectedRowId(item.id);
                setOpenChatSidebar(true);
              }}
            >
              <MessageSquare />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Asset ID: {item.assetID ?? "—"}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 text-cxs capitalize pt-2">
            {item.status && (
              <Badge
                value={item.status}
                styleMap={badgeStyles.families.status}
              />
            )}
          </div>
        </div>

        <Separator width="100%" className="flex-none" />

        {/* Tab nav */}
        <div className="flex flex-wrap gap-2 md:justify-evenly py-2 -mt-2 w-full">
          {TAB_CONFIG.map(({ key, label, icon: Icon }) => {
            // Hide tabs whose underlying stage hasn't happened yet
            if (key === "in-transit" && !hasInTransitTab) return null;
            if (key === "received" && !hasReceivedTab) return null;
            if (key === "costs" && !hasCostsTab) return null;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={cn(
                  "flex flex-1 max-w-40 items-center gap-2 text-xs px-3 py-1.5 rounded-md border transition-colors hover:cursor-pointer",
                  activeTab === key
                    ? "bg-primary/70 dark:bg-primary text-(--clr-textLight) dark:text-gray-900 border-transparent"
                    : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400",
                )}
              >
                <Icon className="w-4.5 h-4.5" />
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Tab: Request ── */}
        {activeTab === "request" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <SectionTitle>Transfer details</SectionTitle>
              <Field label="Asset ID" value={item.assetID} />
              <Field label="Equipment" value={request?.equipment} />
              <Field label="Area" value={request?.area} />
              <Field label="From" value={request?.locationFrom} />
              <Field label="To" value={request?.locationTo} />
              <Field label="Expected date" value={request?.expectedDate} />
              <Field label="Schedule name" value={request?.schedule_name} />
              <Field
                label="Created"
                value={formatDateTime(item.transferCreated)}
              />
            </div>

            <Separator width="100%" />

            <div className="flex flex-col gap-3">
              <SectionTitle>Requested by</SectionTitle>
              {request?.requestor_name && (
                <PersonRow
                  name={request?.requested_by}
                  // Add the user request location and group?
                  sub={`${request?.locationFrom} · ${formatDateTime(item.transferCreated) ?? ""}`}
                />
              )}
            </div>

            <Separator width="100%" />

            <SectionTitle>Reason for transfer</SectionTitle>
            <DescriptionBox>{request?.transferReason}</DescriptionBox>

            {request?.description && (
              <>
                <Separator width="100%" className="my-1" />
                <SectionTitle>Description</SectionTitle>
                <DescriptionBox>{request.description}</DescriptionBox>
              </>
            )}
          </div>
        )}

        {/* ── Tab: In-transit (approval + transport) ── */}
        {activeTab === "in-transit" && (
          <div className="flex flex-col gap-4">
            {approved && (
              <>
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-md px-3 py-2 max-w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  Approved · {formatDateTime(approved.approvedDate)}
                </div>
                <div className="flex flex-col gap-3">
                  <SectionTitle>Approved by</SectionTitle>
                  <PersonRow
                    name={approved?.approvedBy}
                    sub={`Approval ID · ${approved.approvedDate}`}
                  />
                </div>
              </>
            )}

            {approved && inTransit && <Separator width="100%" />}

            {inTransit && (
              <>
                <div className="flex flex-col gap-3">
                  <SectionTitle>Marked in transit by</SectionTitle>
                  {/* Add the name of the person that put the asset in transit */}
                  <PersonRow
                    name={inTransit.inTransitBy}
                    sub={formatDateTime(inTransit.dateCreated) ?? ""}
                  />
                </div>

                <Separator width="100%" />

                <div className="flex flex-col gap-3">
                  <SectionTitle>Transport details</SectionTitle>
                  <Field
                    label="Transport type"
                    value={inTransit.transportType}
                  />
                  <Field label="Transport by" value={inTransit.transportName} />
                  <Field
                    label="Tracking number"
                    value={inTransit.trackingNumber}
                  />
                  <Field
                    label="Transport date"
                    value={inTransit.transportDate}
                  />
                </div>

                {inTransit.transportNotes && (
                  <>
                    <Separator width="100%" />
                    <SectionTitle>Notes</SectionTitle>
                    <DescriptionBox>{inTransit.transportNotes}</DescriptionBox>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Tab: Received ── */}
        {activeTab === "received" && completed && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-md px-3 py-2 max-w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              Received · {formatDateTime(completed.dateReceived)}
            </div>

            <div className="flex flex-col gap-3">
              <SectionTitle>Received by</SectionTitle>
              <PersonRow
                name={completed.receivedBySub}
                sub={formatDateTime(completed.dateReceived) ?? ""}
              />
            </div>

            <Separator width="100%" />

            <div className="flex flex-col gap-3">
              <SectionTitle>Condition</SectionTitle>
              <Badge
                value={completed.condition}
                styleMap={badgeStyles.families.status}
              />
            </div>

            {isDamaged && completed.damageDetails && (
              <>
                <Separator width="100%" />
                <SectionTitle>Damage details</SectionTitle>
                <DescriptionBox>{completed.damageDetails}</DescriptionBox>
              </>
            )}

            {completed.receiptNotes && (
              <>
                <Separator width="100%" />
                <SectionTitle>Notes</SectionTitle>
                <DescriptionBox>{completed.receiptNotes}</DescriptionBox>
              </>
            )}

            {completed?.deliveryNote && completed.deliveryNote.length > 0 && (
              <>
                <Separator width="100%" className="my-1" />
                <SectionTitle>Delivery note</SectionTitle>
                <div className="flex flex-col gap-1">
                  {completed.deliveryNote.map((doc, i) => (
                    <Link
                      key={i}
                      to={doc.url}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {doc.filename ?? `View delivery note ${i + 1}`}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Tab: Costs ── */}
        {activeTab === "costs" && inTransit && (
          <div className="flex flex-col gap-4">
            <SectionTitle>Cost breakdown</SectionTitle>
            {/* <div className="grid grid-cols-2 gap-3">
              <CostCard
                label="Transport"
                value={inTransit?.transportCost ?? 0}
              />
            </div> */}

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-4 py-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total cost
              </span>
              <span className="text-xl font-semibold">
                R {(Number(inTransit.transportCost) || 0).toLocaleString()}
              </span>
            </div>

            {/* Invoices */}
            <Separator width="100%" />
            <SectionTitle>Invoices</SectionTitle>
            {inTransit.invoices && inTransit.invoices.length > 0 ? (
              <div className="flex flex-col gap-2">
                {inTransit.invoices.map((inv, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 dark:border-gray-700 rounded-md px-3 py-2"
                  >
                    <Link to={inv.url}>{inv.filename ?? inv.url}</Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                No invoices attached
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransferItemDetails;
