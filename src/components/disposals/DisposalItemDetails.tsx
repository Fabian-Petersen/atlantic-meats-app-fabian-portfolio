import { useState } from "react";
import Separator from "@/components/dashboardSidebar/Seperator";
import { cn } from "@/lib/utils";
import { ImageGallery } from "../features/ImageGallery";
import type { DisposalWorkflowResponse } from "@/schemas/disposalsSchemas";
import { Link } from "react-router-dom";

// $ ————— Feature Components ——————————————————————————————————————————————————————
import SectionTitle from "../features/layout/SectionTitle";
import Field from "../features/layout/Field";
import DescriptionBox from "../features/layout/DescriptionBox";
import PersonRow from "../features/layout/PersonRow";
import EmptyDataState from "../features/layout/EmptyDataState";

// $ ————— config ——————————————————————————————————————————————————————————————————
type Tab = "request" | "disposed" | "costs";
const TAB_CONFIG = [
  { key: "request", label: "Request", icon: ClipboardList },
  { key: "disposed", label: "Disposed", icon: PackageCheck },
  { key: "costs", label: "Costs", icon: Receipt },
] as const;

// Detail responses can add signed URLs to completion file metadata.
function signedFiles(files: { filename: string }[] = []) {
  return files.flatMap((file) =>
    "url" in file && typeof file.url === "string" && file.url
      ? [
          {
            filename: file.filename,
            url: file.url,
            key:
              "key" in file && typeof file.key === "string"
                ? file.key
                : file.url,
          },
        ]
      : [],
  );
}

// $ ————— utils ——————————————————————————————————————————————————————————————————
import { formatDateTime } from "@/utils/formatDateTime";
import {
  MessageSquare,
  ClipboardList,
  PackageCheck,
  Receipt,
} from "lucide-react";
import useGlobalContext from "@/context/useGlobalContext";
import { sharedStyles } from "@/styles/shared";

// ── Types ────────────────────────────────────────────────────────────────────

type Props = {
  item: DisposalWorkflowResponse;
};

// $ ── Main component ────────────────────────────────────────────────────────────
function DisposalItemDetails({ item }: Props) {
  const [rawActiveTab, setActiveTab] = useState<Tab>("request");
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const { setOpenChatSidebar, setSelectedRowId } = useGlobalContext();

  const request = item.pending;
  const approved = item.approved?.approvedDate ? item.approved : null;
  const disposed = item.disposed?.disposedDate ? item.disposed : null;
  const rejected = item.rejected;
  const cancelled = item.cancelled;
  const assets = item.assets ?? [];
  const activeTab = rawActiveTab;
  const currentAsset = assets[selectedAssetIndex] ?? assets[0];
  const activeImages =
    activeTab === "disposed"
      ? signedFiles(disposed?.disposalImages)
      : (currentAsset?.images ?? []);
  const documents = disposed?.disposalDocuments ?? [];
  const description =
    "description" in request && typeof request.description === "string"
      ? request.description
      : item.description;

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
          key={`${activeTab}-${selectedAssetIndex}`}
          images={activeImages}
          className="p-0"
        />
      </div>

      {/* ── RIGHT: Detail panel ── */}
      <div
        className="relative flex flex-col flex-1 gap-4 text-font dark:text-gray-100 rounded-md p-4 border border-gray-100 dark:border-gray-700/50 min-h-0 overflow-y-auto 
      custom-scrollbar pr-4 dark:bg-(--bg-primary_dark)"
      >
        {/* Header */}
        <div className="flex flex-col gap-2 sticky">
          <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium select-none">
            Disposal · {item.id}
          </p>
          <div className="flex justify-between items-center">
            <h1 className="text-lg md:text-xl font-semibold capitalize leading-tight">
              {currentAsset?.equipment}
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

          {assets.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {assets.map((asset, index) => (
                <button
                  key={asset.assetIndex ?? index}
                  type="button"
                  onClick={() => setSelectedAssetIndex(index)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                    index === selectedAssetIndex
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600",
                  )}
                >
                  {asset.equipment} · {asset.assetID}
                </button>
              ))}
            </div>
          )}
        </div>

        <Separator width="100%" className="flex-none" />

        {/* Tab nav */}
        <div className="flex flex-wrap justify-start gap-2 py-2 -mt-2 w-full">
          {TAB_CONFIG.map(({ key, label, icon: Icon }) => {
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={cn(
                  "flex shrink-0 items-center gap-2 text-xs px-3 py-1.5 rounded-md border transition-colors hover:cursor-pointer",
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
            <>
              {approved && (
                <div className="flex flex-col gap-3">
                  <SectionTitle>Approved by</SectionTitle>
                  <div className="flex items-center gap-2 justify-between">
                    <PersonRow
                      name={approved.approvedBy}
                      // sub={`Approval ID · ${approved.approvalId}`}
                    />
                    <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-md px-3 py-2 max-w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      Approved · {formatDateTime(approved.approvedDate)}
                    </div>
                  </div>
                </div>
              )}

              {rejected && (
                <div className="flex flex-col gap-3">
                  <SectionTitle>Rejected by</SectionTitle>
                  <div className="flex items-center gap-2 justify-between">
                    <PersonRow name={rejected.rejectedBy} />
                    <div className="flex items-center gap-2 text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 rounded-md px-3 py-2 max-w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      Rejected · {formatDateTime(rejected.rejectedDate)}
                    </div>
                  </div>
                  {rejected.rejectionReason && (
                    <>
                      <SectionTitle>Reason for rejection</SectionTitle>
                      <DescriptionBox
                        className={cn(sharedStyles.descriptionReject)}
                      >
                        <span>Reason: {rejected.rejectionReason}</span>
                      </DescriptionBox>
                    </>
                  )}
                </div>
              )}

              {cancelled && (
                <div className="flex flex-col gap-3">
                  <SectionTitle>Cancelled by</SectionTitle>
                  <div className="flex items-center gap-2 justify-between">
                    <PersonRow
                      name={cancelled.cancelledBy || cancelled.cancelledBySub}
                    />
                    <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 rounded-md px-3 py-2 max-w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      Cancelled · {formatDateTime(cancelled.cancelledDate)}
                    </div>
                  </div>
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
              <SectionTitle>Disposal details</SectionTitle>
              <Field label="Asset ID" value={currentAsset?.assetID} />
              <Field label="Equipment" value={currentAsset?.equipment} />
              <Field label="Area" value={currentAsset?.area} />
              <Field
                label="Issue reason"
                value={currentAsset?.assetIssueReason}
              />
              <Field
                label="Issue details"
                value={currentAsset?.assetIssueDetails}
              />
              <Field label="Location" value={request?.location} />
              <Field
                label="Expected disposal date"
                value={request?.expectedDisposalDate}
              />
              <Field label="Schedule name" value={item.schedule_name} />
              <Field
                label="Created"
                value={formatDateTime(item.disposalCreated)}
              />
            </div>

            <Separator width="100%" />

            <div className="flex flex-col gap-3">
              <SectionTitle>Requested by</SectionTitle>
              {(request?.requestedBy || request?.requestorName) && (
                <PersonRow
                  name={request?.requestedBy || request?.requestorName}
                  // Add the user request location and group?
                  sub={`${request?.location} · ${formatDateTime(item.disposalCreated) ?? ""}`}
                />
              )}
            </div>

            <Separator width="100%" />

            <SectionTitle>Reason for disposal</SectionTitle>
            <DescriptionBox>{request?.disposalReason}</DescriptionBox>
            {description && (
              <>
                <SectionTitle>Description</SectionTitle>
                <DescriptionBox>{description}</DescriptionBox>
              </>
            )}
            {item.expired && (
              <>
                <SectionTitle>Expired</SectionTitle>
                <Field
                  label="Expired date"
                  value={formatDateTime(item.expired.expiredDate)}
                />
                <DescriptionBox>{item.expired.reason}</DescriptionBox>
              </>
            )}
          </div>
        )}

        {activeTab === "disposed" && (
          <div className="flex flex-col gap-4 w-full h-full">
            {disposed ? (
              <>
                <SectionTitle>Disposed by</SectionTitle>
                <PersonRow
                  name={disposed.disposedBy}
                  sub={formatDateTime(disposed.disposedDate) ?? ""}
                />
                <Separator width="100%" />
                <SectionTitle>Disposal details</SectionTitle>
                <Field
                  label="Disposal method"
                  value={disposed.disposalMethod}
                />
                <Field
                  label="Disposal location"
                  value={disposed.disposalLocation}
                />
                <Field
                  label="Disposed date"
                  value={formatDateTime(disposed.disposedDate)}
                />
                {disposed.disposalNotes && (
                  <>
                    <SectionTitle>Notes</SectionTitle>
                    <DescriptionBox>{disposed.disposalNotes}</DescriptionBox>
                  </>
                )}
                <Separator width="100%" />
                <SectionTitle>Documents</SectionTitle>
                {documents.length ? (
                  documents.map((doc, index) => {
                    const file = signedFiles([doc])[0];
                    return file ? (
                      <Link
                        key={index}
                        to={file.url}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {doc.filename}
                      </Link>
                    ) : (
                      <p key={index} className="text-sm text-gray-500">
                        {doc.filename}
                      </p>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-400">No documents attached</p>
                )}
              </>
            ) : (
              <EmptyDataState
                icon={PackageCheck}
                heading="Not yet disposed"
                message="Disposal details will appear here once the assets have been disposed of."
              />
            )}
          </div>
        )}
        {activeTab === "costs" && (
          <div className="flex flex-col gap-4 w-full h-full">
            {disposed?.disposalCost != null ? (
              <>
                <SectionTitle>Cost breakdown</SectionTitle>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-4 py-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total disposal cost
                  </span>
                  <span className="text-xl font-semibold">
                    R {disposed.disposalCost.toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <EmptyDataState
                icon={Receipt}
                heading="No cost data yet"
                message="Disposal costs will appear here once they have been recorded."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DisposalItemDetails;
