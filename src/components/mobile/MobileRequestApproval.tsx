import useGlobalContext from "@/context/useGlobalContext";
import type { JobAPIResponse } from "@/schemas";
import { usePOST } from "@/utils/api";
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
// import { Separator } from "@/components/ui/separator";

// $ ─── Types ────────────────────────────────────────────────────────────────────

type MobileRequestApprovalProps = {
  item: JobAPIResponse;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const priorityStyles: Record<string, string> = {
  critical:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  medium:
    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
};

const impactStyles: Record<string, string> = {
  critical:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  medium:
    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
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

function DetailRow({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 py-3 items-center">
      <div className="mt-0.5 shrink-0">
        <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="flex-1 min-w-0 flex justify-between items-center">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
          {label}
        </p>
        {children ?? (
          <p className="text-sm text-gray-700 dark:text-gray-100 capitalize leading-relaxed">
            {value || "—"}
          </p>
        )}
      </div>
    </div>
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
  } = useGlobalContext();
  const hasImages = item.images && item.images.length > 0;
  const navigate = useNavigate();

  const { mutateAsync: approveRequest, isPending } = usePOST({
    resourcePath: "job-request-approved",
    queryKey: ["maintenanceRequest"],
  });

  const handleSubmit = async () => {
    setShowApproveRequestDialog(true);
    const payload = {
      selectedRowId: selectedRowId,
      status: "In Progress",
    };

    try {
      await approveRequest(payload);
      // console.log("approve-request:", response);
      toast.success("The itemm was sucessfully rejected");
      navigate("/jobs-list-approved");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 lg:hidden w-full">
      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700/60 px-4 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/jobs-list-pending")}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
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
          onClick={() => setOpenChatSidebar(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden xs:inline">Comments</span>
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Header card */}
        <div className="mx-4 mt-4 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700/60 p-4">
          <div className="mb-3">
            <div className="flex justify-between items-center min-w-0">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                Equipment
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                Asset ID
              </p>
            </div>
            <div className="flex justify-between items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <p className="text-sm text-gray-700 dark:text-gray-100 capitalize leading-snug">
                {item?.equipment}
              </p>
              <p className="text-gray-700 text-sm">{item?.assetID}</p>
            </div>
          </div>
        </div>

        {/* Details card */}
        <div className="mx-4 mt-3 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700/60 divide-y divide-gray-100 dark:divide-gray-700/60 px-4">
          <DetailRow
            icon={User}
            label="Requested by"
            value={item?.requested_by}
          />
          <DetailRow icon={MapPin} label="Location" value={item?.location} />
          <DetailRow icon={Tag} label="Type" value={item?.type} />
          <DetailRow icon={Zap} label="Impact">
            <Badge value={item?.impact} styleMap={impactStyles} />
          </DetailRow>
          <DetailRow icon={Wrench} label="Priority">
            <Badge value={item?.priority} styleMap={priorityStyles} />
          </DetailRow>
        </div>

        {/* Description card */}
        {item?.description && (
          <div className="mx-4 mt-3 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700/60 p-4">
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
          <div className="mx-4 mt-3 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700/60 p-4">
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

        {/* Images */}
        <div className="mx-4 mt-3 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700/60 p-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Attached photos {hasImages ? `(${item.images!.length})` : ""}
          </p>
          {hasImages ? (
            <div className="grid grid-cols-2 gap-2">
              {item.images!.map((image, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800"
                >
                  <img
                    src={image.url}
                    alt={`Job photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
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
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/jobs-list-pending")}
            className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setShowRejectRequestDialog(true)}
            className="flex-1 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs font-medium dark:text-red-200 text-red-400 dark:(--clr-red-600) hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
