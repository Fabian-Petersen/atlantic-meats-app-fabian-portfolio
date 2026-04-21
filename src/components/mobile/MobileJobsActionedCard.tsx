import {
  ChevronDown,
  MapPin,
  Calendar,
  // Wrench,
  File,
  User,
  // Clock,
} from "lucide-react";
import type { ActionAPIResponse } from "@/schemas";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
// import { usePOST } from "@/utils/api";
// import { toast } from "sonner";
import useGlobalContext from "@/context/useGlobalContext";
// import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

type JobsActionedCardProps = {
  row: Row<ActionAPIResponse>;
  isOpen: boolean;
  onToggle: () => void;
};

export default function MobileJobsActionedCard({
  row,
  isOpen,
  onToggle,
}: JobsActionedCardProps) {
  // const priority =
  //   priorityConfig[row.original.priority?.toLowerCase()] ?? priorityConfig.low;

  const navigate = useNavigate();

  const {
    // selectedRowId,
    setSelectedRowId,
    // setShowRejectRequestDialog,
    // setShowApproveRequestDialog,
  } = useGlobalContext();

  // const { mutateAsync: approveRequest, isPending } = usePOST({
  //   resourcePath: "jobs/requests/approved",
  //   queryKey: ["maintenanceRequest", "approved"],
  // });

  // const handleSubmit = async () => {
  //   setShowApproveRequestDialog(true);
  //   const payload = {
  //     selectedRowId: selectedRowId,
  //     status: "In Progress",
  //   };

  //   try {
  //     await approveRequest(payload);
  //     // console.log("approve-request:", response);
  //     toast.success("The itemm was sucessfully rejected");
  //     navigate("/jobs/approved");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="rounded-md border border-gray-200 dark:border-(--clr-borderDark) bg-white dark:bg-(--bg-primary_dark) mb-2 overflow-hidden transition-shadow hover:shadow-sm">
      {/* Always-visible header — tap to expand */}
      <button
        type="button"
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />

        {/* Location + meta row */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-1 justify-between">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {row.original.location}
              </p>
            </div>
            {/* Jobcard Number */}
            <div className="flex items-center gap-1.5 mb-1">
              <File className="w-3 h-3 text-gray-400 shrink-0" />
              <p className="text-cxs font-medium text-gray-900 dark:text-gray-100 truncate">
                {row.original.jobcardNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-cxs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {row.original.actionCreated}
            </span>
          </div>
        </div>
      </button>

      {/* Expanded section */}
      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-700/60 px-4 py-3 flex flex-col gap-3">
          {/* Technician */}
          <div className="flex items-start gap-2">
            <User className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <div className="flex-1 flex items-center justify-between gap-2">
              <span className="text-xs text-gray-800 dark:text-gray-200 capitalize font-medium">
                {row.original.actioned_by}
              </span>
            </div>
          </div>
          {/* Description */}
          {row.original.findings && (
            <div>
              <p className="text-xs text-(--clr-textLight) dark:text-text-dark">
                Findings:
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                {row.original.findings}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {/* View full details */}
            <button
              type="button"
              className={cn(sharedStyles.btnCancel)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRowId(row.original.id);
                navigate(`/jobs/${row.original.id}/pending`);
              }}
            >
              Cancel
            </button>

            {/* View Details */}
            <button
              type="button"
              className={cn(sharedStyles.btnView)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRowId(row.original.id);
                navigate(`/jobs/actioned/${row.original.id}`);
              }}
            >
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
