import {
  ChevronDown,
  MapPin,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import type {
  ActionAPIResponse,
  JobcardPresignedUrlResponse,
} from "@/schemas";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { CardRow } from "../CardRow";
import { Badge } from "../../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { AnimatePresence, motion } from "motion/react";
import { motionVariants } from "@/styles/motionStyles";
import { DropdownMenuButtonDialog } from "@/components/modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";

type JobsActionedCardProps = {
  row: Row<ActionAPIResponse>;
  isOpen: boolean;
  onToggle: () => void;
  downloadItem: (id: string) => Promise<JobcardPresignedUrlResponse>;
};

export default function MobileJobsCompletedCard({
  row,
  isOpen,
  onToggle,
  downloadItem,
}: JobsActionedCardProps) {
  const item = row.original;
  const navigate = useNavigate();
  const { setSelectedRowId, setOpenChatSidebar } = useGlobalContext();

  const menuItems = getTableMenuItems({
    rowId: item.id,
    request_id: item.request_id,
    setSelectedRowId,
    view: {
      label: "View Job Details",
      onOpen: () => navigate(`/jobs/${item.id}/complete`),
    },
    download: {
      onDownload: downloadItem,
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
        isOpen && sharedStyles.cardIsOpen,
      )}
      onClick={onToggle}
    >
      {/* Always-visible header — tap to expand */}
      <div className={cn(sharedStyles.cardBtn, "gap-0")} onClick={onToggle}>
        {/* // $ ——— Location + Meta Row —————————————————————————————————————————————————— */}
        <div className={sharedStyles.mobileCardHeaderContent}>
          <CardRow
            icon={MapPin}
            value={item.location}
            className="capitalize text-(--clr-textLight) py-0"
            valueStyles={sharedStyles.mobileCardTitle}
            iconStyles="w-3.5 h-3.5 text-blue-500 dark:text-blue-400"
          />
          <CardRow
            value={item.jobcardNumber}
            icon={FileText}
            className=""
            valueStyles={sharedStyles.mobileCardMeta}
            iconStyles="w-3.5 h-3.5 text-teal-500 dark:text-teal-400"
          />
          <CardRow
            icon={Calendar}
            value={item.completed_at}
            className=""
            labelStyles=""
            valueStyles={sharedStyles.mobileCardMeta}
            iconStyles="w-3.5 h-3.5 text-purple-500 dark:text-purple-400"
          />
        </div>
        <div className={sharedStyles.mobileCardActions}>
          <Badge
            value={item.status}
            styleMap={badgeStyles.families.status}
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

      {/* // $ ——— Expanded Section ——————————————————————————————————————————————————————*/}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={motionVariants.expandable}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 dark:border-gray-700/60 py-3 flex flex-col gap-3">
              {/* // $ ——— Technician ———————————————————————————————————————————————————————— */}
              <div className="flex justify-between items-center">
                <CardRow
                  label="Actioned By"
                  className="py-0"
                  valueStyles="hidden"
                />
                <CardRow
                  icon={User}
                  className="py-0"
                  value={item.actioned_by}
                  iconStyles="dark:text-blue-500"
                />
              </div>
              {/* // $ ——— Findings ———————————————————————————————————————————————————————— */}
              {item.findings && (
                <div className="flex flex-col">
                  <CardRow
                    label="findings"
                    labelStyles="text-sm"
                    valueStyles="hidden"
                    className="py-0"
                  />
                  <CardRow value={item.findings} className="py-1" />
                </div>
              )}

              {item.work_completed && (
                <div className="flex flex-col border-t border-gray-100 dark:border-gray-700/60 pt-2">
                  <CardRow
                    label="Work Completed"
                    labelStyles="text-sm"
                    valueStyles="hidden"
                    className="py-0"
                  />
                  <CardRow value={item.work_completed} className="py-1" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
