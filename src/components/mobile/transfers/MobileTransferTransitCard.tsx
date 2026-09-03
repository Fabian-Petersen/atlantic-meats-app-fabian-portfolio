import { useNavigate } from "react-router-dom";
import type { Row } from "@tanstack/react-table";
import {
  ChevronDown,
  Truck,
  Calendar,
  Hash,
  // Wallet,
  MapPin,
  ArrowRight,
  Hammer,
  DollarSign,
} from "lucide-react";

import type { TransferWorkflowResponse } from "@/schemas";
import type { Resource } from "@/utils/api";
import { DropdownMenuButtonDialog } from "../../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import { CardRow } from "../CardRow";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { motionVariants } from "@/styles/motionStyles";

type MobileTransferTransitCardProps = {
  row: Row<TransferWorkflowResponse>;
  isOpen: boolean;
  onToggle: () => void;
  setShowUpdateAssetDialog: (v: boolean) => void;
  setSelectedRowId: (id: string) => void;
  openDeleteDialog: (
    selectedRowId: string,
    config: {
      resourcePath: Resource;
      queryKey: readonly unknown[];
      resourceName?: string;
    },
  ) => void;
};

function MobileTransferTransitCard({
  row,
  isOpen,
  onToggle,
  setShowUpdateAssetDialog,
  setSelectedRowId,
  //   openDeleteDialog,
}: MobileTransferTransitCardProps) {
  const item = row.original;
  const navigate = useNavigate();

  // console.log("itemTransit:", item);
  const rowId = item.id;
  const hasAsset = item.assets?.length > 0;

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
        isOpen && sharedStyles.cardIsOpen,
      )}
    >
      {/* ── Header (always visible, toggles expansion) ── */}
      <div className="flex items-center justify-between gap-2 w-full">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center justify-between gap-2 flex-1 min-w-0 text-left"
        >
          <div className="flex flex-col flex-1 min-w-0 gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-textDark capitalize">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-500" />
              <span className="truncate">{item?.pending?.locationFrom}</span>
              <ArrowRight className="w-3 h-3 shrink-0 text-green-500" />
              <span className="truncate">{item?.pending?.locationTo}</span>
            </div>
            <CardRow
              value={item?.pending?.expectedDate}
              icon={Calendar}
              className="capitalize dark:text-(--clr-textDark) text-(--clr-textLight) py-0"
              valueStyles="text-xs text-gray-400 dark:text-gray-400 font-mono"
              iconStyles="w-3.5 h-3.5 text-teal-500 dark:text-teal-400"
            />
          </div>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          {/* <Badge
            value={item.status}
            styleMap={badgeStyles.families.transfer_status}
            className={cn("capitalize")}
          /> */}
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
        <Truck className="w-3.5 h-3.5 shrink-0 text-yellow-400" />
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
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex flex-col gap-2 divide-y divide-gray-300/80 dark:divide-gray-700/60">
              {hasAsset && (
                <div className="flex flex-col gap-1.5 pb-3">
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
                        value={asset.assetID || asset.assetIssueReason || "-"}
                        className="divide-gray-300/80 dark:divide-gray-700/60"
                      />
                    ))}
                  </div>
                </div>
              )}
              <CardRow
                icon={Calendar}
                label="Date created"
                className="py-3"
                value={new Date(
                  item["in-transit"]?.dateTransitCreated ?? "",
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
                className="py-3"
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
                className="py-3"
                value={item["in-transit"]?.trackingNumber}
              />
              <CardRow
                icon={DollarSign}
                label="Cost"
                className="py-3 border border-red-500 dark:border-red-400"
                iconStyles="dark:text-red-400"
                value={String(item["in-transit"]?.transportCost ?? "")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MobileTransferTransitCard;

/* -------------------------------------------------------------------------- */
/*                                  OLD CARD                                  */
/* -------------------------------------------------------------------------- */

// import { useNavigate } from "react-router-dom";
// import type { Row } from "@tanstack/react-table";
// import { ChevronDown, Truck, Calendar, Hash, Wallet } from "lucide-react";

// import type { TransferWorkflowResponse } from "@/schemas";
// import type { Resource } from "@/utils/api";
// import { DropdownMenuButtonDialog } from "../../modals/DropdownMenuButtonDialog";
// import { getTableMenuItems } from "@/lib/getTableMenuItems";
// import { CardRow } from "../CardRow";
// import { sharedStyles } from "@/styles/shared";
// import { cn } from "@/lib/utils";
// import { AnimatePresence, motion } from "framer-motion";
// import { motionVariants } from "@/styles/motionStyles";

// type MobileTransferTransitCardProps = {
//   row: Row<TransferWorkflowResponse>;
//   isOpen: boolean;
//   onToggle: () => void;
//   setShowUpdateAssetDialog: (v: boolean) => void;
//   setSelectedRowId: (id: string) => void;
//   openDeleteDialog: (
//     selectedRowId: string,
//     config: {
//       resourcePath: Resource;
//       queryKey: readonly unknown[];
//       resourceName?: string;
//     },
//   ) => void;
// };

// function MobileTransferTransitCard({
//   row,
//   isOpen,
//   onToggle,
//   setShowUpdateAssetDialog,
//   setSelectedRowId,
//   //   openDeleteDialog,
// }: MobileTransferTransitCardProps) {
//   const item = row.original;
//   const navigate = useNavigate();

//   console.log("itemTransit:", item);
//   const rowId = item.id;

//   const menuItems = getTableMenuItems({
//     rowId: item.id,
//     setSelectedRowId,
//     receipt: {
//       url: `api/transfers/${rowId}/receipt`,
//       onOpen: () => {
//         setSelectedRowId(rowId);
//         navigate(`/transfers/${rowId}/receipt`);
//       },
//     },
//     edit: {
//       url: `api/transfers/${rowId}`,
//       onOpen: () => {
//         setShowUpdateAssetDialog(true);
//         setSelectedRowId(rowId);
//       },
//     },
//     view: {
//       url: `api/transfers/${rowId}`,
//       onOpen: () => {
//         setSelectedRowId(rowId);
//         navigate(`/transfers/${rowId}`);
//       },
//     },

//     // delete: {
//     //   config: {
//     //     resourcePath: `api/transfers/${rowId}`,
//     //     queryKey: ["transfers", "transfer-delete"],
//     //     resourceName: "transfer",
//     //   },
//     //   onDelete: openDeleteDialog,
//     // },
//   });

//   return (
//     <div
//       className={cn(
//         sharedStyles.cardRowParent,
//         "flex flex-col",
//         isOpen && sharedStyles.cardIsOpen,
//       )}
//     >
//       {/* ── Header (always visible, toggles expansion) ── */}
//       <div className="flex items-center justify-between gap-2 w-full">
//         <button
//           type="button"
//           onClick={onToggle}
//           className="flex items-center justify-between gap-2 flex-1 min-w-0 text-left"
//         >
//           <div className="flex flex-col min-w-0">
//             <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize truncate">
//               {item?.assets[0]?.equipment}
//             </span>
//             <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
//               {item?.assets[0]?.assetID}
//             </span>
//           </div>
//         </button>
//         <div className="flex items-center gap-2 shrink-0">
//           {/* <Badge
//             value={item.status}
//             styleMap={badgeStyles.families.transfer_status}
//             className={cn("capitalize")}
//           /> */}
//           <div onClick={(e) => e.stopPropagation()}>
//             <DropdownMenuButtonDialog menuItems={menuItems} />
//           </div>
//           <button
//             type="button"
//             onClick={onToggle}
//             aria-label={isOpen ? "Collapse" : "Expand"}
//           >
//             <ChevronDown
//               className={cn(
//                 "w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200",
//                 isOpen && "rotate-180",
//               )}
//             />
//           </button>
//         </div>
//       </div>

//       {/* ── Collapsed summary ── */}
//       <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1.5 capitalize">
//         <Truck className="w-3.5 h-3.5 shrink-0" />
//         <span className="truncate">{item["in-transit"]?.transportType}</span>
//         {item["in-transit"]?.transportName && (
//           <>
//             <span className="text-gray-300 dark:text-gray-600">•</span>
//             <span className="truncate">
//               {item["in-transit"]?.transportName}
//             </span>
//           </>
//         )}
//       </div>

//       {/* ── Expanded details ── */}
//       <AnimatePresence initial={false}>
//         {isOpen && (
//           <motion.div
//             variants={motionVariants.expandable}
//             initial="closed"
//             animate="open"
//             exit="closed"
//             className="overflow-hidden"
//           >
//             <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex flex-col gap-2">
//               <CardRow
//                 icon={Calendar}
//                 label="Date created"
//                 value={new Date(
//                   item["in-transit"]?.dateTransitCreated ?? "",
//                 ).toLocaleString("en-GB", {
//                   day: "2-digit",
//                   month: "2-digit",
//                   year: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   hour12: false,
//                 })}
//               />
//               <CardRow
//                 icon={Calendar}
//                 label="Transport date"
//                 value={new Date(
//                   item["in-transit"]?.transportDate ?? "",
//                 ).toLocaleString("en-GB", {
//                   day: "2-digit",
//                   month: "2-digit",
//                   year: "numeric",
//                 })}
//               />
//               <CardRow
//                 icon={Hash}
//                 label="Tracking number"
//                 value={item["in-transit"]?.trackingNumber}
//               />
//               <CardRow
//                 icon={Wallet}
//                 label="Cost"
//                 value={String(item["in-transit"]?.transportCost ?? "")}
//               />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default MobileTransferTransitCard;
