import { useNavigate } from "react-router-dom";
import type { Row } from "@tanstack/react-table";
import {
  ChevronDown,
  MapPin,
  ArrowRight,
  Calendar,
  User,
  FileText,
  MessageSquare,
  Barcode,
  Hammer,
} from "lucide-react";

import type { TransferPendingTableRow } from "@/schemas";
import useGlobalContext from "@/context/useGlobalContext";
import { CardRow } from "../CardRow";
import { Badge } from "../../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { motionVariants } from "@/styles/motionStyles";

type MobileTransferRequestCardProps = {
  row: Row<TransferPendingTableRow>;
  isOpen: boolean;
  onToggle: () => void;
};

function MobileTransferRequestCard({
  row,
  isOpen,
  onToggle,
}: MobileTransferRequestCardProps) {
  const item = row.original;
  const navigate = useNavigate();
  const { setSelectedRowId } = useGlobalContext();

  const isPending = item.status === "pending";

  const handleReview = () => {
    setSelectedRowId(item.id);
    navigate(`/transfers/${item.id}/pending-approval`);
  };

  return (
    <div
      className={cn(
        sharedStyles.cardRowParent,
        "flex flex-col",
        isOpen && sharedStyles.cardIsOpen,
      )}
      onClick={onToggle}
    >
      {/* ── Header (always visible, toggles expansion) ── */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(sharedStyles.cardBtn, "gap-0")}
      >
        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <CardRow
            value={item.equipment}
            icon={Hammer}
            className="capitalize text-(--clr-textLight) py-0"
            valueStyles="text-md font-semibold dark:text-white/90"
            iconStyles="w-3.5 h-3.5 text-purple-500 dark:text-purple-400"
          />
          <CardRow
            value={item.assetID}
            icon={Barcode}
            className="capitalize dark:text-(--clr-textDark) text-(--clr-textLight) py-0"
            valueStyles="text-xs text-gray-400 dark:text-gray-400 font-mono"
            iconStyles="w-3.5 h-3.5 text-teal-500 dark:text-teal-400"
          />
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-500" />
            <span className="truncate">{item.locationFrom}</span>
            <ArrowRight className="w-3 h-3 shrink-0 text-green-500" />
            <span className="truncate">{item.locationTo}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            value={item.status}
            styleMap={badgeStyles.families.transfer_status}
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

      {/* ── Expanded details ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={motionVariants.expandable}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex flex-col gap-2">
              <CardRow
                icon={User}
                label="Requested by"
                value={item.requestor_name || item.requested_by}
              />
              <CardRow
                icon={Calendar}
                label="Requested on"
                value={item.transferCreated}
              />
              <CardRow
                icon={Calendar}
                label="Expected date"
                value={item.expectedDate}
              />

              {item.description && (
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="text-xs">Description</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed pl-5">
                    {item.description}
                  </p>
                </div>
              )}

              {item.transferReason && (
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-xs">Reason</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed pl-5">
                    {item.transferReason}
                  </p>
                </div>
              )}

              {isPending && (
                <button
                  type="button"
                  onClick={handleReview}
                  className={cn(
                    sharedStyles.btnApprove,
                    sharedStyles.btn,
                    "mt-2 text-sm uppercase",
                  )}
                >
                  Review Request
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MobileTransferRequestCard;
