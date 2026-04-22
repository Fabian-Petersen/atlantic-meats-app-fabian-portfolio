import {
  ChevronDown,
  MapPin,
  Calendar,
  // Wrench,
  // File,
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
import { CardRow } from "./CardRow";

type JobsActionedCardProps = {
  row: Row<ActionAPIResponse>;
  isOpen: boolean;
  onToggle: () => void;
};

export default function MobileJobsCompletedCard({
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
        className="w-full text-left px-2 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />

        {/* Location + meta row */}
        <div className="flex flex-col w-full gap-0.5 min-w-0">
          <div className="flex justify-between items-center py-0">
            <CardRow
              icon={MapPin}
              value={row.original.location}
              className="capitalize dark:text-(--clr-textDark) text-(--clr-textLight) py-0"
              valueStyles="text-md"
              iconStyles="dark:text-green-300 text-green-500"
            />
            <CardRow
              value={row.original.jobcardNumber}
              className="py-0"
              valueStyles="text-cxs"
            />
          </div>
          <div className="flex flex-col gap-3">
            <CardRow
              label="Date Completed"
              icon={Calendar}
              value={row.original.completed_at}
              className="w-full"
              labelStyles=""
              valueStyles=""
            />
          </div>
        </div>
      </button>

      {/* Expanded section */}
      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-700/60 px-4 py-3 flex flex-col gap-3">
          {/* Technician */}
          <div className="flex justify-between items-center">
            <CardRow
              label="Actioned By"
              className="py-0"
              valueStyles="hidden"
            />
            <CardRow
              icon={User}
              className="py-0"
              value={row.original.actioned_by}
              iconStyles="dark:text-blue-500"
            />
          </div>
          {/* Findings */}

          {row.original.findings && (
            <div className="flex flex-col">
              <CardRow
                label="findings"
                labelStyles="text-sm"
                valueStyles="hidden"
                className="py-0"
              />
              <CardRow value={row.original.findings} className="py-1" />
            </div>
          )}

          {row.original.work_completed && (
            <div className="flex flex-col border-t border-gray-100 dark:border-gray-700/60 pt-2">
              <CardRow
                label="Work Completed"
                labelStyles="text-sm"
                valueStyles="hidden"
                className="py-0"
              />
              <CardRow value={row.original.work_completed} className="py-1" />
            </div>
          )}

          {/* Actions */}
          <div className={cn(sharedStyles.btnParent)}>
            <button
              type="button"
              className={cn(sharedStyles.btnSubmit, sharedStyles.btn)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRowId(row.original.id);
                navigate(`/jobs/${row.original.id}/completed`);
              }}
            >
              View Job Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
