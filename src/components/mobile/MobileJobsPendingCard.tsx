import { ChevronDown, MapPin, Calendar, Wrench } from "lucide-react";
import { Badge } from "../features/Badge";
import type { JobAPIResponse } from "@/schemas";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
// import { usePOST } from "@/utils/api";
// import { toast } from "sonner";
import useGlobalContext from "@/context/useGlobalContext";
// import { toast } from "sonner";
// import { priorityConfig } from "@/lib/priorityConfig";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { badgeStyles } from "@/styles/badgeStyles";

type MaintenanceRequestCardProps = {
  row: Row<JobAPIResponse>;
  isOpen: boolean;
  onToggle: () => void;
};

export default function MobileJobsPendingCard({
  row,
  isOpen,
  onToggle,
}: MaintenanceRequestCardProps) {
  // const priority =
  //   priorityConfig[row.original.priority?.toLowerCase()] ?? priorityConfig.low;
  const item = row.original;
  const navigate = useNavigate();

  const {
    setSelectedRowId,
    setShowRejectRequestDialog,
    setShowApproveRequestDialog,
  } = useGlobalContext();

  // const { mutateAsync: approveRequest, isPending } = usePOST({
  //   id: selectedRowId ?? "",
  //   resourcePath: "jobs",
  //   queryKey: ["jobs", "approve-request"],
  //   action: "approve",
  // });

  // const handleSubmit = async () => {
  //   setShowApproveRequestDialog(true);
  //   const payload = {
  //     selectedRowId: selectedRowId,
  //     status: "in progress",
  //   };

  //   try {
  //     await approveRequest(payload);
  //     // console.log("approve-request:", response);
  //     toast.success("The itemm was sucessfully rejected");
  //     navigate("/jobs/in-progress");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className={cn(sharedStyles.cardRowParent, "flex flex-col")}>
      {/* Always-visible header — tap to expand */}
      <button
        type="button"
        className={cn(sharedStyles.cardBtn)}
        onClick={onToggle}
      >
        {/* Location + meta row */}
        <div className="flex-1 min-w-0 gap-1 flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate capitalize">
              {item.location}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {item.jobCreated}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            value={item.priority}
            styleMap={badgeStyles.families.priority}
            className={cn("capitalize")}
          />
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Expanded section */}
      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-700/60 px-4 py-3 flex flex-col gap-3">
          {/* Equipment + Asset ID */}
          <div className="flex items-start gap-2">
            <Wrench className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <div className="flex-1 flex items-center justify-between gap-2">
              <span className="text-sm text-gray-800 dark:text-gray-200 capitalize font-medium">
                {item.equipment}
              </span>
              <span className="text-xs text-gray-500 font-mono shrink-0 dark:text-green-500">
                #{item.assetID}
              </span>
            </div>
          </div>

          {/* Description */}
          {item.jobComments && (
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
              {item.jobComments}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {/* View full details */}
            <button
              type="button"
              className="flex-1 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/jobs/${item.id}/pending-approval`);
                setSelectedRowId(item.id);
              }}
            >
              View Details
            </button>

            {/* Reject */}
            <button
              type="button"
              className="flex-1 py-2 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border dark:border-(--clr-borderDarkRed)"
              onClick={(e) => {
                e.stopPropagation();
                setShowRejectRequestDialog(true);
                setSelectedRowId(item.id);
              }}
            >
              Reject
            </button>

            {/* Approve */}
            <button
              type="button"
              // disabled={isPending}
              className="flex-1 py-2 text-xs font-medium rounded-lg dark:bg-green/20 bg-green-500/10 border-green/20 hover:bg-green-500/90 hover:shadow-md text-green-500 border dark:border-green/30 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRowId(item.id);
                setShowApproveRequestDialog(true);
              }}
            >
              Approve
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
