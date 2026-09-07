import { useState } from "react";
import Separator from "@/components/dashboardSidebar/Seperator";
import { cn } from "@/lib/utils";
import { ImageGallery } from "../../features/ImageGallery";
import type { DisposalWorkflowResponse } from "@/schemas/disposalsSchemas";
import { useNavigate, Link } from "react-router-dom";

// $ ————— Feature Components ——————————————————————————————————————————————————————
import SectionTitle from "../../features/layout/SectionTitle";
import Field from "../../features/layout/Field";
import DescriptionBox from "../../features/layout/DescriptionBox";
import PersonRow from "../../features/layout/PersonRow";
import EmptyDataState from "../../features/layout/EmptyDataState";

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
      ? [{ filename: file.filename, url: file.url,
          key: "key" in file && typeof file.key === "string" ? file.key : file.url }]
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
  ChevronDown,
  ChevronLeft,
  ImageIcon,
} from "lucide-react";
import useGlobalContext from "@/context/useGlobalContext";
import { sharedStyles } from "@/styles/shared";

// ── Types ────────────────────────────────────────────────────────────────────

type Props = {
  item: DisposalWorkflowResponse;
};

// $ ── Main component ────────────────────────────────────────────────────────────
function MobileDisposalsItemDetails({ item }: Props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("request");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { setOpenChatSidebar, setSelectedRowId } = useGlobalContext();

  const request = item.pending;
  const approved = item.approved?.approvedDate ? item.approved : null;
  const disposed = item.disposed?.disposedDate ? item.disposed : null;
  const rejected = item.rejected;
  const cancelled = item.cancelled;
  const assets = item.assets ?? [];
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const currentAsset = assets[selectedAssetIndex] ?? assets[0];
  const activeImages = activeTab === "disposed"
    ? signedFiles(disposed?.disposalImages) : (currentAsset?.images ?? []);
  const documents = disposed?.disposalDocuments ?? [];
  const description = "description" in request && typeof request.description === "string"
    ? request.description : item.description;

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
            Disposal · {currentAsset?.assetID ?? "—"}
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
          {currentAsset?.equipment}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Asset ID: {currentAsset?.assetID ?? "—"}
        </p>
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

      {/* ── Tab nav: horizontal scroll ── */}
      <div className="flex justify-start items-center gap-2 px-1 py-3 no-scrollbar overflow-x-auto border-b border-gray-100 dark:border-gray-700/50">
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
                  Rejected · {formatDateTime(rejected.rejectedDate)}
                </div>
              ) : cancelled ? (
                <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 rounded-md px-3 py-2 max-w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  Cancelled · {formatDateTime(cancelled.cancelledDate)}
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
                    sub={formatDateTime(rejected.rejectedDate) ?? ""}
                  />
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
                  <PersonRow
                    name={cancelled.cancelledBy || cancelled.cancelledBySub}
                    sub={formatDateTime(cancelled.cancelledDate) ?? ""}
                  />
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
              <Field label="Location" value={request?.location} />
              <Field label="Expected disposal date" value={request?.expectedDisposalDate} />
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
                  sub={`${request?.location} · ${formatDateTime(item.disposalCreated) ?? ""}`}
                />
              )}
            </div>

            <Separator width="100%" />

            <SectionTitle>Reason for disposal</SectionTitle>
            <DescriptionBox>{request?.disposalReason}</DescriptionBox>
            {description && <><SectionTitle>Description</SectionTitle><DescriptionBox>{description}</DescriptionBox></>}
            {item.expired && <>
              <SectionTitle>Expired</SectionTitle>
              <Field label="Expired date" value={formatDateTime(item.expired.expiredDate)} />
              <DescriptionBox>{item.expired.reason}</DescriptionBox>
            </>}
          </div>
        )}

        {activeTab === "disposed" && (
          <div className="flex flex-col gap-4 w-full h-full">
            {disposed ? <>
              <SectionTitle>Disposed by</SectionTitle>
              <PersonRow name={disposed.disposedBy} sub={formatDateTime(disposed.disposedDate) ?? ""} />
              <Separator width="100%" />
              <SectionTitle>Disposal details</SectionTitle>
              <Field label="Disposal method" value={disposed.disposalMethod} />
              <Field label="Disposal location" value={disposed.disposalLocation} />
              <Field label="Disposed date" value={formatDateTime(disposed.disposedDate)} />
              {disposed.disposalNotes && <>
                <SectionTitle>Notes</SectionTitle>
                <DescriptionBox>{disposed.disposalNotes}</DescriptionBox>
              </>}
              <Separator width="100%" />
              <SectionTitle>Documents</SectionTitle>
              {documents.length ? documents.map((doc, index) => {
                const file = signedFiles([doc])[0];
                return file
                  ? <Link key={index} to={file.url} className="text-sm text-blue-500 hover:underline">{doc.filename}</Link>
                  : <p key={index} className="text-sm text-gray-500">{doc.filename}</p>;
              }) : <p className="text-sm text-gray-400">No documents attached</p>}
            </> : <EmptyDataState icon={PackageCheck} heading="Not yet disposed" message="Disposal details will appear here once the assets have been disposed of." />}
          </div>
        )}
        {activeTab === "costs" && (
          <div className="flex flex-col gap-4 w-full h-full">
            {disposed?.disposalCost != null ? <>
              <SectionTitle>Cost breakdown</SectionTitle>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-4 py-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total disposal cost</span>
                <span className="text-xl font-semibold">R {disposed.disposalCost.toLocaleString()}</span>
              </div>
            </> : <EmptyDataState icon={Receipt} heading="No cost data yet" message="Disposal costs will appear here once they have been recorded." />}
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
              <ImageGallery key={`${activeTab}-${selectedAssetIndex}`} images={activeImages} className="p-0" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileDisposalsItemDetails;
