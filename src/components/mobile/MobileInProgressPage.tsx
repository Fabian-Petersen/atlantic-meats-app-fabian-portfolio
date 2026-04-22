import useGlobalContext from "@/context/useGlobalContext";
import type { JobApprovedAPIResponse } from "@/schemas";
import { MobileImageModal } from "./MobileImageModal";
import { CardRow } from "./CardRow";
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
} from "lucide-react";

// $ ─── React Hooks ──────────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// $ ─── Styles ───────────────────────────────────────────────────────────────────
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

// $ ─── Types ────────────────────────────────────────────────────────────────────
type MobileRequestApprovalProps = {
  item: JobApprovedAPIResponse;
};

// $ ─── Helpers ──────────────────────────────────────────────────────────────────
const priorityStyles: Record<string, string> = {
  critical:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  medium:
    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
};

const impactStyles: Record<string, string> = {
  compliance:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  production:
    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  safety:
    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
};

// $ ─── Badge Component ────────────────────────────────────────────────────────────
function Badge({
  value,
  styleMap,
}: {
  value: string;
  styleMap: Record<string, string>;
}) {
  const key = value?.toLowerCase();
  const cls =
    styleMap[key] ??
    "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${cls}`}
    >
      {value}
    </span>
  );
}

// $ ─── Main Component ─────────────────────────────────────────────────────────────
export default function MobileInProgressPage({
  item,
}: MobileRequestApprovalProps) {
  const { setOpenChatSidebar } = useGlobalContext();
  const hasImages = item.images && item.images.length > 0;
  const navigate = useNavigate();

  // state lives in the parent
  const [imageIndex, setImageIndex] = useState<number | null>(null);

  return (
    <div className={cn(sharedStyles.cardParent)}>
      {/* // $ ─── Sticky Top Bar ──────────────────────────────────── */}
      <div className={cn(sharedStyles.cardTopBar, "z-5")}>
        <button
          type="button"
          onClick={() => navigate("/jobs/in-progress")}
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex-1 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 py-0.5">
            Jobcard No.
          </p>
          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 font-mono py-0.5">
            {item?.jobcardNumber}
          </p>
        </div>

        {/* // $ ─── Comment Button ──────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setOpenChatSidebar(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden xs:inline">Comments</span>
        </button>
      </div>

      {/* // $ ─── Scrollable Content ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Header card */}
        <div className={cn(sharedStyles.cardRowParent, "py-2 mb-3")}>
          <CardRow
            label="Equipment"
            value={item?.equipment}
            className="py-1.5"
          />
          <CardRow label="Asset ID" value={item?.assetID} className="py-1.5" />
          <CardRow label="Area" value={item?.area} className="py-1.5" />
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

        {/* Comments card */}
        {item?.jobComments && (
          <div className={cn(sharedStyles.cardRowParent)}>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Job comments
              </p>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              {item.jobComments}
            </p>
          </div>
        )}

        {imageIndex !== null && (
          <MobileImageModal
            images={item.images!}
            initialIndex={imageIndex}
            onClose={() => setImageIndex(null)}
          />
        )}
        {/* Images */}
        <div className={cn(sharedStyles.cardRowParent)}>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Attached photos {hasImages ? `(${item.images!.length})` : ""}
          </p>
          {hasImages ? (
            <div className="grid grid-cols-2 gap-2">
              {item.images!.map((image, i) => (
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
          <button
            type="button"
            onClick={() => navigate(`/jobs/${item?.id}/action`)}
            className={cn(
              sharedStyles.btnApprove,
              sharedStyles.btn,
              "text-sm uppercase flex gap-6 justify-center items-center",
            )}
          >
            <div className="flex items-center justify-center gap-4">
              <Wrench className="w-6 h-6" />
              <span>Action Job</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
