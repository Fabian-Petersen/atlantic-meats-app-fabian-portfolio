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
  Eye,
} from "lucide-react";

import { Badge } from "@/components/features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { isTargetDateOverdue } from "@/lib/isTargetDateOverdue";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { motionVariants } from "@/styles/motionStyles";
import { DropdownMenuButtonDialog } from "@/components/modals/DropdownMenuButtonDialog";

type Props = {
  row: Row<JobApprovedAPIResponse>;
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileJobsInProgressCard({ row, isOpen, onToggle }: Props) {
  const navigate = useNavigate();

  const { setSelectedRowId } = useGlobalContext();

  const menuItems = [
    {
      id: "view",
      label: "View Details",
      icon: Eye,
      onClick: () => {
        navigate(`/jobs/${row.original.id}/in-progress`);
        setSelectedRowId(row.original.id);
      },
    },
    {
      id: "action",
      label: "Action",
      icon: Wrench,
      onClick: () => {
        setSelectedRowId(row.original.id);
        navigate(`/jobs/${row.original.id}/action`);
      },
    },
  ];

  return (
    <div
      className={cn(
        sharedStyles.cardRowParent,
        "flex flex-col",
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
              className={`flex items-center gap-3 text-xs ${isTargetDateOverdue(row.original.targetDate) ? "text-red-500" : "dark:text-gray-500"}`}
            >
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {row.original.targetDate}
              </span>
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
