import useGlobalContext from "@/context/useGlobalContext";
import type { JobApprovedAPIResponse } from "@/schemas";
import { MobileImageModal } from "../MobileImageModal";
import { CardRow } from "../CardRow";
import {
  MessageSquare,
  MapPin,
  User,
  Wrench,
  Tag,
  Zap,
  FileText,
  ChevronLeft,
  ImageOff,
  CalendarClock,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "../../features/Badge";

// $ ─── React Hooks ──────────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// $ ─── Styles ───────────────────────────────────────────────────────────────────
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { impactStyles } from "@/styles/impactStyles";
import { priorityStyles } from "@/styles/priorityStyles";

// $ ─── Types ────────────────────────────────────────────────────────────────────
type MobileRequestApprovalProps = {
  item: JobApprovedAPIResponse;
  selectedAssetIndex: number;
  onSelectAsset: (index: number) => void;
};

// $ ─── Main Component ─────────────────────────────────────────────────────────────
/**
 *MobileInProgressPage
 *Path: "/jobs/:id/in-progress"
 *
 *Purpose:
 * - Enables users to view a single open (status === in progress) maintenance job requests.
 *
 *Responsibilities:
 * - Renders the page layout and heading.
 * - Handles navigation on user action page "/jobs/:id/action".
 *
 *Layout Behavior:
 * - Mobile: Rendered as a full standalone page.
 * - Desktop: Rendered as a full standalone page.
 *
 *Navigation:
 * - Back: Redirects user to "/jobs/in-progress".
 * - Action:
 *    - Redirect the user to the action page "/jobs/:id/action"
 *
 *Dependencies:
 * - MobileImageModal (form logic and submission)
 * - CardRow (Page Item)
 * - Shared layout styles
 */
export default function MobileInProgressPage({
  item,
  selectedAssetIndex,
  onSelectAsset,
}: MobileRequestApprovalProps) {
  const { setOpenChatSidebar, setIsOpen, openDeleteDialog, user } =
    useGlobalContext();
  const canActionJob = user?.group?.toLowerCase() === "maintenance";
  const assets = item.assets?.length
    ? item.assets
    : [
        {
          equipment: item.equipment,
          assetID: item.assetID,
          area: item.area,
          assetIssueReason: item.assetIssueReason,
          assetIssueDetails: item.assetIssueDetails,
          images: item.images ?? [],
        },
      ];
  const currentAsset = assets[selectedAssetIndex] ?? assets[0];
  const hasImages = !!currentAsset?.images?.length;
  const navigate = useNavigate();

  // Image State
  const [imageIndex, setImageIndex] = useState<number | null>(null);

  return (
    <div className={cn(sharedStyles.cardParent)}>
      {/* // $ ─── Sticky Top Bar ──────────────────────────────────── */}
      <div className={cn(sharedStyles.cardTopBar, "z-5 py-4")}>
        <button
          type="button"
          onClick={() => navigate("/jobs/in-progress")}
          className="flex items-center gap-1.5 text-xs text-red-400 dark:text-red-400/95 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex-1 text-center">
          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 font-mono py-0.5">
            {item?.jobcardNumber}
          </p>
        </div>

        {/* // $ ─── Comment Button ──────────────────────────────────── */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setOpenChatSidebar(true);
          }}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden xs:inline">Comments</span>
        </button>
      </div>

      {/* // $ ─── Scrollable Content ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-32">
        {assets.length > 1 && (
          <div className={cn(sharedStyles.cardRowParent)}>
            <p className="mb-2 text-xs text-gray-400 dark:text-gray-500">
              Assets in this request
            </p>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {assets.map((asset, index) => (
                <button
                  key={`${asset.assetID ?? "asset"}-${index}`}
                  type="button"
                  onClick={() => {
                    setImageIndex(null);
                    onSelectAsset(index);
                  }}
                  className={cn(
                    "shrink-0 rounded-md border p-1.5 text-xs font-medium capitalize transition-all",
                    index === selectedAssetIndex
                      ? "border-green-400 bg-green-400/10 text-green-600 dark:text-green-400"
                      : "border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400",
                  )}
                >
                  {`Asset ${index + 1} · ${asset.assetID || "No ID"}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Header card */}
        <div className={cn(sharedStyles.cardRowParent, "mb-3 py-2")}>
          <CardRow
            label="Equipment"
            value={currentAsset?.equipment}
            className="py-1.5"
          />
          <CardRow
            label="Asset ID"
            value={currentAsset?.assetID || "Not provided"}
            className="py-1.5"
          />
        </div>

        {/* Details card */}
        <div
          className={cn(
            sharedStyles.cardRowParent,
            "divide-y divide-gray-100 dark:divide-gray-700/60",
          )}
        >
          <CardRow
            icon={User}
            label="Requested by"
            value={item?.requested_by}
          />
          <CardRow icon={MapPin} label="Location" value={item?.location} />
          <CardRow icon={MapPin} label="Area" value={currentAsset?.area} />
          <CardRow
            icon={Tag}
            label="Issue reason"
            value={currentAsset?.assetIssueReason}
          />
          <CardRow
            icon={FileText}
            label="Issue details"
            value={currentAsset?.assetIssueDetails}
          />
          <CardRow icon={Tag} label="Type" value={item?.type} />
          <CardRow icon={Zap} label="Impact">
            <Badge value={item?.impact} styleMap={impactStyles} />
          </CardRow>
          <CardRow icon={Wrench} label="Priority">
            <Badge value={item?.priority} styleMap={priorityStyles} />
          </CardRow>
          <CardRow
            icon={CalendarClock}
            label="Target Date"
            value={item?.targetDate}
          />
          <CardRow
            icon={User}
            label="Assigned to"
            value={item?.assign_to_name}
          />
          <CardRow
            icon={Wrench}
            label="Assigned group"
            value={item?.assign_to_group}
          />
          <CardRow
            icon={User}
            label="Approved by"
            value={item?.approved_by}
          />
          <CardRow
            icon={CalendarClock}
            label="Approved"
            value={item?.approved_at}
          />
        </div>

        {/* Description card */}
        {item?.description && (
          <div className={cn(sharedStyles.cardRowParent)}>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Description of Request
              </p>
            </div>
            <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
              {item.description}
            </p>
          </div>
        )}
        {imageIndex !== null && (
          <MobileImageModal
            images={currentAsset!.images}
            initialIndex={imageIndex}
            onClose={() => setImageIndex(null)}
          />
        )}
        {/* Images */}
        <div className={cn(sharedStyles.cardRowParent)}>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Attached photos {hasImages ? `(${currentAsset!.images.length})` : ""}
          </p>
          {hasImages ? (
            <div className="grid grid-cols-2 gap-2">
              {currentAsset!.images.map((image, i) => (
                <button
                  aria-label="image button to open images"
                  type="button"
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 active:scale-95 transition-transform"
                >
                  <img
                    src={image.url}
                    alt={`Job photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <ImageOff className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              <p className="text-xs text-gray-400 dark:text-gray-500">
                No photos attached
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky action bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700/60 px-2 pt-3 pb-6 safe-area-inset-bottom">
        <div className={cn(sharedStyles.btnParent, "")}>
          {canActionJob ? (
            <button
              type="button"
              onClick={() => navigate(`/jobs/${item.id}/in-progress/action`)}
              className={cn(
                sharedStyles.btnApprove,
                sharedStyles.btn,
                "text-sm uppercase flex gap-6 justify-center items-center",
              )}
            >
              <Wrench className="w-6 h-6" />
              <span>Action Job</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() =>
                  openDeleteDialog(item.id, {
                    resourcePath: "api/jobs",
                    queryKey: ["jobs"],
                    resourceName: "job",
                  })
                }
                className={cn(
                  sharedStyles.btnCancel,
                  sharedStyles.btn,
                  "text-sm uppercase flex gap-4 justify-center items-center",
                )}
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
              <button
                type="button"
                onClick={() => navigate(`/jobs/${item.id}/in-progress/update`)}
                className={cn(
                  sharedStyles.btnSubmit,
                  sharedStyles.btn,
                  "text-sm uppercase flex gap-4 justify-center items-center",
                )}
              >
                <Pencil className="w-5 h-5" />
                Update
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
