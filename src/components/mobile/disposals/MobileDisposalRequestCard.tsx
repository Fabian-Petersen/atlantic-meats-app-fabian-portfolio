import { useNavigate } from "react-router-dom";
import type { Row } from "@tanstack/react-table";
import {
  ChevronDown,
  MapPin,
  ArrowRight,
  Calendar,
  User,
  MessageSquare,
  Hammer,
} from "lucide-react";

import type { DisposalPendingTableRow } from "@/schemas/disposalsSchemas";
import useGlobalContext from "@/context/useGlobalContext";
import { CardRow } from "../CardRow";
import { Badge } from "../../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { motionVariants } from "@/styles/motionStyles";
import { DropdownMenuButtonDialog } from "@/components/modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";

type MobileDisposalRequestCardProps = {
  row: Row<DisposalPendingTableRow>;
  isOpen: boolean;
  onToggle: () => void;
};

function MobileDisposalRequestCard({
  row,
  isOpen,
  onToggle,
}: MobileDisposalRequestCardProps) {
  const item = row.original;
  const navigate = useNavigate();
  const { setSelectedRowId, setShowUpdateAssetDialog } = useGlobalContext();

  const rowId = item.id;
  const isStatusPending = item.status === "pending";
  const hasAsset = item.assets?.length > 0;
  // const hasMultipleAssets = item.assets?.length > 1;

  const menuItems = getTableMenuItems({
    rowId: item.id,
    status: item.status,
    setSelectedRowId,
    transit: {
      url: `api/transfers/${rowId}/in-transit`,
      onOpen: () => {
        setSelectedRowId(rowId);
        navigate(`/transfers/${rowId}/in-transit`);
      },
    },
    edit: {
      url: `api/transfers/${rowId}`,
      onOpen: () => {
        setShowUpdateAssetDialog(true);
        setSelectedRowId(rowId);
      },
    },
    view: {
      url: `api/transfers/${rowId}`,
      onOpen: () => {
        setSelectedRowId(rowId);
        navigate(`/transfers/${rowId}`);
      },
    },
  });

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
        <div className="flex flex-col flex-1 min-w-0 gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-textDark capitalize">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-500" />
            <span className="truncate">{item.location}</span>
            <ArrowRight className="w-3 h-3 shrink-0 text-green-500" />
            <span className="truncate">{item.disposalReason}</span>
          </div>{" "}
          <CardRow
            value={item?.disposalCreated}
            icon={Calendar}
            className="capitalize dark:text-(--clr-textDark) text-(--clr-textLight) py-0"
            valueStyles="text-xs text-gray-400 dark:text-gray-400 font-mono"
            iconStyles="w-3.5 h-3.5 text-teal-500 dark:text-teal-400"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            value={item.status}
            styleMap={badgeStyles.families.transfer_status}
            className={cn("capitalize")}
          />
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenuButtonDialog menuItems={menuItems} />
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </button>
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
            <div className="mt-3 border-t border-gray-300/80 dark:border-gray-700/60 flex flex-col gap-2 divide-y divide-gray-300/80 dark:divide-gray-700/60">
              {hasAsset && (
                <div className="flex flex-col gap-1.5 py-3">
                  <CardRow
                    label="Assets Moved"
                    value={`${item.assets.length}`}
                    valueStyles="dark:bg-blue-600 bg-blue-500 w-full h-full p-1 text-white dark:text-white rounded-full flex item-center justify-center size-6 border-0"
                  />
                  <div className="flex flex-col gap-1">
                    {item.assets.map((asset) => (
                      <CardRow
                        icon={Hammer}
                        label={asset.equipment}
                        value={asset.assetID}
                        className="divide-gray-300/80 dark:divide-gray-700/60"
                      />
                    ))}
                  </div>
                </div>
              )}
              <CardRow
                icon={User}
                label="Requested by"
                value={item.requestorName || item.requestedBy}
                className="py-3"
              />
              <CardRow
                icon={Calendar}
                label="Expected date"
                value={item.expectedDisposalDate}
                className="py-3"
              />
              {item.description && (
                <div className="flex flex-col gap-1 mt-1 pb-3">
                  <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-xs">Reason</span>
                  </div>
                  <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed pl-5">
                    {item.description}
                  </p>
                </div>
              )}

              {isStatusPending && (
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

export default MobileDisposalRequestCard;
