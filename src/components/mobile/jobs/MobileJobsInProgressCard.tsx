import type { JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  MapPin,
  Calendar,
  Wrench,
  FileClock,
  User,
  Clock2Icon,
  AlertTriangle,
} from "lucide-react";

import { Badge } from "@/components/features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { getTargetDateStatus } from "@/lib/isTargetDateOverdue";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { motionVariants } from "@/styles/motionStyles";
import { DropdownMenuButtonDialog } from "@/components/modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";

type Props = {
  row: Row<JobApprovedAPIResponse>;
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileJobsInProgressCard({ row, isOpen, onToggle }: Props) {
  const navigate = useNavigate();

  const { setSelectedRowId, openDeleteDialog, setOpenChatSidebar } =
    useGlobalContext();

  const rowId = row.original.id;
  const targetDateStatus = getTargetDateStatus(row.original.targetDate);
  const isOverdue = targetDateStatus === "overdue";
  const menuItems = getTableMenuItems({
    rowId,
    setSelectedRowId,
    action: {
      onOpen: () => navigate(`/jobs/${rowId}/in-progress/action`),
    },
    edit: {
      onOpen: () => navigate(`/jobs/${rowId}/in-progress/update`),
    },
    view: {
      label: "View Details",
      onOpen: () => navigate(`/jobs/${rowId}/in-progress`),
    },
    delete: {
      config: {
        resourcePath: "api/jobs",
        queryKey: ["jobs"],
        resourceName: "job",
      },
      onDelete: openDeleteDialog,
    },
    comments: {
      onOpen: () => setOpenChatSidebar(true),
    },
  });

  return (
    <div
      className={cn(
        sharedStyles.cardRowParent,
        "flex flex-col",
        isOverdue &&
          "border-l-4 border-l-red-500 bg-red-50/70 dark:bg-red-950/20",
        targetDateStatus === "due-today" && "border-l-4 border-l-orange-500",
        targetDateStatus === "upcoming" && "border-l-4 border-l-green-500",
        isOpen && sharedStyles.cardIsOpen, // Apply the cardIsOpen style when isOpen is true
      )}
      onClick={onToggle}
    >
      <div
        className="w-full text-left py-3 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        {/* Location + meta row */}
        <div className={sharedStyles.mobileCardHeaderContent}>
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <p className={sharedStyles.mobileCardTitle}>
              {row.original.location}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FileClock className="w-3 h-3" />
                {row.original.jobcardNumber}
              </span>
            </div>
            <div
              className={`flex flex-wrap items-center gap-2 text-xs ${isOverdue ? "text-red-600 dark:text-red-400" : "dark:text-gray-500"}`}
            >
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {row.original.targetDate}
              </span>
              {isOverdue && (
                <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-red-700 dark:border-red-800 dark:bg-red-950/70 dark:text-red-300">
                  <AlertTriangle className="size-3" aria-hidden="true" />
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Priority badge */}
        <div className={sharedStyles.mobileCardActions}>
          <Badge
            value={row.original.priority}
            styleMap={badgeStyles.families.priority}
            className={sharedStyles.mobileCardBadge}
          />
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenuButtonDialog menuItems={menuItems} />
          </div>
          {/* Chevron */}
          <ChevronDown
            className={cn(
              sharedStyles.mobileCardChevron,
              isOpen && "rotate-180",
            )}
          />
        </div>
      </div>

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
                    {row.original.equipment}
                  </span>
                  <span className="text-xs text-gray-500 font-mono shrink-0 dark:text-green-500">
                    #{row.original.assetID}
                  </span>
                </div>
              </div>
              {/* Target Date &Technician */}
              <div className="flex items-start gap-2">
                <User className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1 flex items-center justify-between gap-2">
                  <span className="capitalize text-xs text-gray-500 font-mono shrink-0 dark:text-gray-200">
                    {row.original.assign_to_name}
                  </span>
                  <div className="flex gap-1 dark:text-gray-500">
                    <Clock2Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span className="text-xs  capitalize font-medium">
                      {row.original.jobCreated}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
