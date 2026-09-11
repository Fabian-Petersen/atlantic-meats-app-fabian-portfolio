import {
  CheckCircle2,
  ChevronDown,
  Eye,
  MapPin,
  Calendar,
  Wrench,
  XCircle,
  Pen,
} from "lucide-react";
import { Badge } from "../../features/Badge";
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
import { AnimatePresence, motion } from "motion/react";
import { motionVariants } from "@/styles/motionStyles";
import { DropdownMenuButtonDialog } from "@/components/modals/DropdownMenuButtonDialog";

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
    setShowUpdateMaintenanceDialog,
  } = useGlobalContext();

  const menuItems = [
    {
      id: "view",
      label: "View Details",
      icon: Eye,
      onClick: () => {
        navigate(`/jobs/${item.id}/pending-approval`);
        setSelectedRowId(item.id);
      },
    },
    {
      id: "edit",
      label: "Edit",
      icon: Pen,
      onClick: () => {
        // navigate(`/jobs/${item.id}/pending-edit`);
        setShowUpdateMaintenanceDialog(true);
        setSelectedRowId(item.id);
      },
    },
    {
      id: "reject",
      label: "Reject",
      icon: XCircle,
      onClick: () => {
        setShowRejectRequestDialog(true);
        setSelectedRowId(item.id);
      },
    },
    {
      id: "approve",
      label: "Approve",
      icon: CheckCircle2,
      onClick: () => {
        setSelectedRowId(item.id);
        setShowApproveRequestDialog(true);
      },
    },
  ];

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
    <div
      className={cn(
        sharedStyles.cardRowParent,
        "flex flex-col",
        isOpen && sharedStyles.cardIsOpen,
      )}
    >
      {/* Always-visible header — tap to expand */}
      <div className={cn(sharedStyles.cardBtn)} onClick={onToggle}>
        {/* Location + meta row */}
        <div className={sharedStyles.mobileCardHeaderContent}>
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <p className={sharedStyles.mobileCardTitle}>{item.location}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {item.jobCreated}
            </span>
          </div>
        </div>
        <div className={sharedStyles.mobileCardActions}>
          <Badge
            value={item.priority}
            styleMap={badgeStyles.families.priority}
            className={sharedStyles.mobileCardBadge}
          />
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenuButtonDialog menuItems={menuItems} />
          </div>
          <ChevronDown
            className={cn(
              sharedStyles.mobileCardChevron,
              isOpen && "rotate-180",
            )}
          />
        </div>
      </div>

      {/* Expanded section */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={motionVariants.expandable}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
          >
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
