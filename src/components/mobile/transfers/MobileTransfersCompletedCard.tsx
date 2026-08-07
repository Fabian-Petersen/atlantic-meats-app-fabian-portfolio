import { useNavigate } from "react-router-dom";
import type { Row } from "@tanstack/react-table";
import {
  ChevronDown,
  Truck,
  Calendar,
  Hash,
  Wallet,
  Barcode,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { TransferWorkflowResponse } from "@/schemas";
// import type { Resource } from "@/utils/api";
import { DropdownMenuButtonDialog } from "../../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import { CardRow } from "../CardRow";
import { Badge } from "../../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { motionVariants } from "@/styles/motionStyles";

type MobileTransferTransitCardProps = {
  row: Row<TransferWorkflowResponse>;
  isOpen: boolean;
  onToggle: () => void;
  setSelectedRowId: (id: string) => void;
};

function MobileTransfersCompletedCard({
  row,
  isOpen,
  onToggle,
  setSelectedRowId,
}: MobileTransferTransitCardProps) {
  const item = row.original;
  const navigate = useNavigate();

  //   console.log("itemTransit:", item);
  const rowId = item.id;

  const menuItems = getTableMenuItems({
    rowId: item.id,
    setSelectedRowId,
    receipt: {
      url: `api/transfers/${rowId}/receipt`,
      onOpen: () => {
        setSelectedRowId(rowId);
        navigate(`/transfers/${rowId}/receipt`);
      },
    },
    edit: {
      url: `api/transfers/${rowId}`,
      onOpen: () => {
        // setShowUpdateAssetDialog(true);
        setSelectedRowId(rowId);
      },
    },
    // delete: {
    //   config: {
    //     resourcePath: `api/transfers/${rowId}`,
    //     queryKey: ["transfers", "transfer-delete"],
    //     resourceName: "transfer",
    //   },
    //   onDelete: openDeleteDialog,
    // },
  });

  return (
    <div
      className={cn(
        sharedStyles.cardRowParent,
        "flex flex-col",
        isOpen && sharedStyles.cardIsOpen, // Apply the cardIsOpen style when isOpen is true
      )}
    >
      {/* ── Header (always visible, toggles expansion) ── */}
      <div className="flex items-center justify-between gap-2 w-full">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center justify-between gap-2 flex-1 min-w-0 text-left"
        >
          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <CardRow
              className="py-0"
              value={item.equipment}
              valueStyles="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize truncate"
            />
            <CardRow
              value={item.assetID}
              icon={Barcode}
              className="capitalize dark:text-(--clr-textDark) text-(--clr-textLight) py-0"
              valueStyles="text-xs text-gray-400 dark:text-gray-400"
              iconStyles="w-3.5 h-3.5 text-teal-500 dark:text-teal-400"
            />
            <CardRow
              value={item["in-transit"]?.transportType}
              icon={Truck}
              className="capitalize dark:text-(--clr-textDark) text-(--clr-textLight) py-0"
              valueStyles="text-xs text-gray-400 dark:text-gray-400"
              iconStyles="w-3.5 h-3.5 text-teal-500 dark:text-teal-400"
            />
          </div>
        </button>
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
      </div>

      {/* ── Collapsed summary ── */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1.5 capitalize">
        <Truck className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{item["in-transit"]?.transportType}</span>
        {item["in-transit"]?.transportName && (
          <>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="truncate">
              {item["in-transit"]?.transportName}
            </span>
          </>
        )}
      </div>

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
                icon={Calendar}
                label="Date created"
                value={new Date(
                  item["in-transit"]?.dateCreated ?? "",
                ).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              />
              <CardRow
                icon={Calendar}
                label="Transport date"
                value={new Date(
                  item["in-transit"]?.transportDate ?? "",
                ).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              />
              <CardRow
                icon={Hash}
                label="Tracking number"
                value={item["in-transit"]?.trackingNumber}
              />
              <CardRow
                icon={Wallet}
                label="Cost"
                value={String(item["in-transit"]?.transportCost ?? "")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MobileTransfersCompletedCard;
