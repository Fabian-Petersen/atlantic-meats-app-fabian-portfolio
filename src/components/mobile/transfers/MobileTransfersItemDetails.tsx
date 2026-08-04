import { useState } from "react";
import Separator from "@/components/dashboardSidebar/Seperator";
import { Badge } from "../../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { cn } from "@/lib/utils";
import { ImageGallery } from "../../features/ImageGallery";
import type { TransferWorkflowResponse } from "@/schemas/transfersSchemas";
import { useNavigate, Link } from "react-router-dom";

// $ ————— Feature Components ——————————————————————————————————————————————————————
import SectionTitle from "../../features/layout/SectionTitle";
import Field from "../../features/layout/Field";
import DescriptionBox from "../../features/layout/DescriptionBox";
import PersonRow from "../../features/layout/PersonRow";
import EmptyDataState from "../../features/layout/EmptyDataState";

// $ ————— config ——————————————————————————————————————————————————————————————————
import { TAB_CONFIG, type Tab } from "@/lib/transferTabConfig";

// $ ————— utils ——————————————————————————————————————————————————————————————————
import { formatDateTime } from "@/utils/formatDateTime";
import {
  MessageSquare,
  Truck,
  PackageCheck,
  Receipt,
  ChevronDown,
  ChevronLeft,
  ImageIcon,
} from "lucide-react";
import useGlobalContext from "@/context/useGlobalContext";
import { sharedStyles } from "@/styles/shared";

// ── Types ────────────────────────────────────────────────────────────────────

type Props = {
  item: TransferWorkflowResponse;
};

// $ ── Main component ────────────────────────────────────────────────────────────
/**
 * MobileTransferItemDetails
 *
 * Mobile-optimized view of an asset transfer, mirroring the same lifecycle
 * shown on desktop: request (+ approval) → in-transit → received → costs.
 *
 * Reuses the exact same stage-availability logic and shared components as
 * `TransferItemDetails` (desktop) for consistency — only the layout differs:
 * single column, horizontally scrollable tab pills instead of a spread-out
 * row, and a collapsible image gallery to save vertical space on small
 * screens.
 *
 * @param item - Transfer workflow data from API
 */
function MobileTransfersItemDetails({ item }: Props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("request");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { setOpenChatSidebar, setSelectedRowId } = useGlobalContext();

  const request = item.pending;
  const approved = item.approved;
  const inTransit = item["in-transit"];
  const completed = item.completed;
  const rejected = item.rejected;
  const cancelled = item.cancelled;

  // NOTE: the API always sends `"in-transit": { images: [] }` and
  // `"completed": { images: [] }` placeholders even when that stage hasn't
  // happened yet, so `!!inTransit` / `!!completed` are always true. Check a
  // field that only exists once the stage has actually occurred instead.
  const hasInTransitData = !!inTransit?.dateCreated;
  const hasReceivedData = !!completed?.receiptDate;

  const isDamaged = completed?.receiptCondition.toLowerCase() === "damaged";

  const activeImages =
    activeTab === "in-transit"
      ? (inTransit?.images ?? [])
      : activeTab === "completed"
        ? (completed?.receiptImages ?? [])
        : (request?.images ?? []);

  return (
    <div
      className={cn(
        "flex flex-col w-full min-h-0",
        "bg-(--bg-primary-light) text-gray-100 md:hidden",
        "dark:bg-(--bg-primary_dark) dark:text-gray-800",
      )}
    >
      {/* ── Header ── */}
      <div className="flex flex-col gap-2 p-4 sticky top-0 z-10 bg-(--bg-primary-light) dark:bg-(--bg-primary_dark) border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 -ml-1"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium select-none">
            Transfer · {item.assetID ?? "—"}
          </p>
          <button
            type="button"
            aria-label="open chatbar"
            className="text-blue-500 hover:cursor-pointer"
            onClick={() => {
              setSelectedRowId(item.id);
              setOpenChatSidebar(true);
            }}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
        <h1 className="text-lg font-semibold capitalize leading-tight text-(--clr-textLight) dark:text-(--clr-textDark)">
          {request?.equipment}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Asset ID: {item.assetID ?? "—"}
        </p>
      </div>

      {/* ── Tab nav: horizontal scroll ── */}
      <div className="flex justify-evenly items-center gap-2 px-1 py-3 no-scrollbar overflow-x-auto border-b border-gray-100 dark:border-gray-700/50">
        {TAB_CONFIG.map(({ key, label, icon: Icon }) => {
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex items-center gap-1.5 shrink-0 text-xs px-2 py-1.5 rounded-md border transition-colors hover:cursor-pointer",
                activeTab === key
                  ? "bg-primary/70 dark:bg-primary text-(--clr-textLight) dark:text-gray-900 border-transparent"
                  : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400",
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 pb-4">
        {/* ── Tab: Request ── */}
        {activeTab === "request" && (
          <div className="flex flex-col gap-4">
            <>
              {approved ? (
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-md px-3 py-2 max-w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  Approved · {formatDateTime(approved.approvedDate)}
                </div>
              ) : rejected ? (
                <div className="flex items-center gap-2 text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 rounded-md px-3 py-2 max-w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  Rejected · {formatDateTime(rejected.dateRejected)}
                </div>
              ) : cancelled ? (
                <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 rounded-md px-3 py-2 max-w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  Cancelled · {formatDateTime(cancelled.dateCancelled)}
                </div>
              ) : null}

              {approved && (
                <div className="flex flex-col gap-3">
                  <SectionTitle>Approved by</SectionTitle>
                  <PersonRow
                    name={approved.approvedBy}
                    sub={`Approval ID · ${approved.approvalId}`}
                  />
                </div>
              )}

              {rejected && (
                <div className="flex flex-col gap-3">
                  <SectionTitle>Rejected by</SectionTitle>
                  <PersonRow
                    name={rejected.rejectedBy}
                    sub={formatDateTime(rejected.dateRejected) ?? ""}
                  />
                  {rejected.rejectedReason && (
                    <>
                      <SectionTitle>Reason for rejection</SectionTitle>
                      <DescriptionBox
                        className={cn(sharedStyles.descriptionReject)}
                      >
                        <span>Reason: {rejected.rejectedReason}</span>
                      </DescriptionBox>
                    </>
                  )}
                </div>
              )}

              {cancelled && (
                <div className="flex flex-col gap-3">
                  <SectionTitle>Cancelled by</SectionTitle>
                  <PersonRow
                    name={cancelled.cancelledBySub}
                    sub={formatDateTime(cancelled.dateCancelled) ?? ""}
                  />
                  {cancelled.cancelStatus && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Status prior to cancellation:{" "}
                      <span className="capitalize font-medium text-gray-700 dark:text-gray-300">
                        {cancelled.cancelStatus}
                      </span>
                    </p>
                  )}
                  {cancelled.cancelReason && (
                    <>
                      <SectionTitle>Reason for cancellation</SectionTitle>
                      <DescriptionBox>{cancelled.cancelReason}</DescriptionBox>
                    </>
                  )}
                </div>
              )}
            </>

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
          <div className="flex flex-col gap-4 w-full">
            {approved && hasInTransitData && <Separator width="100%" />}

            {hasInTransitData && (
              <>
                <div className="flex flex-col gap-3">
                  <SectionTitle>Marked in transit by</SectionTitle>
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

            {!hasInTransitData && (
              <EmptyDataState
                icon={Truck}
                className="w-full"
                heading="Not yet in transit"
                message="This item hasn't been dispatched yet. Transport details will show up here once it's on the move."
              />
            )}
          </div>
        )}

        {/* ── Tab: Received ── */}
        {activeTab === "completed" && (
          <div className="flex flex-col gap-4 w-full">
            {hasReceivedData ? (
              <>
                {item.status === "completed" ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-md px-3 py-2 max-w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    Received · {formatDateTime(completed.receiptDate)}
                  </div>
                ) : (
                  ""
                )}

                <div className="flex flex-col gap-3">
                  <SectionTitle>Received by</SectionTitle>
                  <PersonRow
                    name={completed.receiptBy}
                    sub={formatDateTime(completed.dateReceiptCreated) ?? ""}
                  />
                </div>

                <Separator width="100%" />

                <div className="flex flex-col gap-3">
                  <SectionTitle>Condition</SectionTitle>
                  <Badge
                    value={completed.receiptCondition}
                    styleMap={badgeStyles.families.condition}
                  />
                </div>

                {isDamaged && completed?.damageDetails && (
                  <>
                    <Separator width="100%" />
                    <SectionTitle>Damage details</SectionTitle>
                    <DescriptionBox
                      className={cn(sharedStyles.descriptionReject)}
                    >
                      {completed.damageDetails}
                    </DescriptionBox>
                  </>
                )}

                {completed.receiptNotes && (
                  <>
                    <Separator width="100%" />
                    <SectionTitle>Notes</SectionTitle>
                    <DescriptionBox>{completed.receiptNotes}</DescriptionBox>
                  </>
                )}

                {completed?.deliveryNote &&
                  completed.deliveryNote.length > 0 && (
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
              </>
            ) : (
              <EmptyDataState
                icon={PackageCheck}
                heading="Not yet received"
                message="Receipt details will appear here once the item arrives and is checked in at its destination."
              />
            )}
          </div>
        )}

        {/* ── Tab: Costs ── */}
        {activeTab === "costs" && (
          <div className="flex flex-col gap-4 w-full">
            {hasInTransitData ? (
              <>
                <SectionTitle>Cost breakdown</SectionTitle>

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
                {inTransit.transportInvoices &&
                inTransit.transportInvoices.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {inTransit.transportInvoices.map((inv, i) => (
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
              </>
            ) : (
              <EmptyDataState
                icon={Receipt}
                heading="No cost data yet"
                message="Transport costs and invoices will show up here once the item is marked in transit."
              />
            )}
          </div>
        )}
        {/* ── Collapsible image gallery ── */}
        <div className="px-4 pb-3">
          <button
            type="button"
            onClick={() => setGalleryOpen((prev) => !prev)}
            className="flex items-center justify-between w-full text-xs text-gray-500 dark:text-gray-400 py-2 border-b border-gray-100 dark:border-gray-700/50 hover:cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              {activeImages.length > 0
                ? `${activeImages.length} image${activeImages.length === 1 ? "" : "s"}`
                : "No images"}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                galleryOpen && "rotate-180",
              )}
            />
          </button>
          {galleryOpen && (
            <div className="mt-2 overflow-hidden rounded-md">
              <ImageGallery images={activeImages} className="p-0" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileTransfersItemDetails;
