import useGlobalContext from "@/context/useGlobalContext";
import type { JobAPIResponse } from "@/schemas";
import { usePOST } from "@/utils/api";
import { CardRow } from "./CardRow";
import { MobileImageModal } from "./MobileImageModal";
import {
  X,
  Check,
  MessageSquare,
  MapPin,
  User,
  Wrench,
  Tag,
  Zap,
  FileText,
  ChevronLeft,
  ImageOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// $ ─── Styles ───────────────────────────────────────────────────────────────────
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { impactStyles } from "@/styles/impactStyles";
import { priorityStyles } from "@/styles/priorityStyles";
import { useState } from "react";

// import { Separator } from "@/components/ui/separator";

// $ ─── Types ────────────────────────────────────────────────────────────────────

type MobileRequestApprovalProps = {
  item: JobAPIResponse;
};

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

// $ ─── Component ────────────────────────────────────────────────────────────────

export default function MobileRequestApproval({
  item,
}: MobileRequestApprovalProps) {
  const {
    selectedRowId,
    setShowRejectRequestDialog,
    setShowApproveRequestDialog,
    setOpenChatSidebar,
    setIsOpen,
  } = useGlobalContext();
  const hasImages = item.images && item.images.length > 0;
  const navigate = useNavigate();

  // Image State
  const [imageIndex, setImageIndex] = useState<number | null>(null);

  const { mutateAsync: approveRequest, isPending } = usePOST({
    id: selectedRowId ?? "",
    resourcePath: "jobs",
    queryKey: ["jobs", "approve-request"],
    action: "approve",
  });

  const handleSubmit = async () => {
    setShowApproveRequestDialog(true);
    const payload = {
      selectedRowId: selectedRowId,
      status: "approved",
    };

    try {
      await approveRequest(payload);
      // console.log("approve-request:", response);
      toast.success("The itemm was sucessfully rejected");
      navigate("/jobs/in-progress");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cn(sharedStyles.cardParent)}>
      {/* ── Sticky top bar ── */}
      <div className={cn(sharedStyles.cardTopBar)}>
        <button
          type="button"
          onClick={() => navigate("/jobs/pending-approval")}
          className="flex items-center gap-1.5 text-sm text-red-400 dark:text-red-400/95 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex-1 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">Request</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 font-mono">
            #{item?.jobcardNumber}
          </p>
        </div>

        {/* Comments button */}
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

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Header card */}
        <div className={cn(sharedStyles.cardRowParent)}>
          <div className="">
            <div className="flex justify-between items-center min-w-0">
              <CardRow
                label="Equipment"
                valueStyles="hidden"
                className="py-1"
              />
              <CardRow label="Asset ID" valueStyles="hidden" className="py-1" />
            </div>
            <div className="flex justify-between items-center">
              <CardRow
                value={item?.equipment}
                className="py-0"
                valueStyles="dark:text-gray-400"
              />
              <CardRow value={item?.assetID} className="py-0" />
            </div>
          </div>
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
        </div>

        {/* Description card */}
        {item?.description && (
          <div className={cn(sharedStyles.cardRowParent)}>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Description
              </p>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
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
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700/60 px-4 pt-3 pb-6 safe-area-inset-bottom">
        <div className={cn(sharedStyles.btnParent)}>
          <button
            type="button"
            onClick={() => setShowRejectRequestDialog(true)}
            className={cn(
              sharedStyles.btnCancel,
              sharedStyles.btn,
              "text-sm uppercase flex gap-6 justify-center items-center",
            )}
          >
            <X className="w-6 h-6" />
            Reject
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleSubmit}
            className={cn(
              sharedStyles.btnApprove,
              sharedStyles.btn,
              "text-sm uppercase flex gap-6 justify-center items-center",
            )}
          >
            {isPending ? (
              <Spinner className="size-6" />
            ) : (
              <Check className="w-6 h-6" />
            )}
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
