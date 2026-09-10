import type { AssetTableRow } from "@/schemas";
import {
  ChevronDown,
  Pencil,
  Eye,
  Trash2,
  Barcode,
  MapPin,
} from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { CardRow } from "../CardRow";
import { AnimatePresence, motion } from "motion/react";
import { motionVariants } from "@/styles/motionStyles";
import { DropdownMenuButtonDialog } from "@/components/modals/DropdownMenuButtonDialog";

type Props = {
  row: Row<AssetTableRow>;
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileAssetRegisterCard({ row, isOpen, onToggle }: Props) {
  const item = row.original;
  const navigate = useNavigate();
  const { setSelectedRowId } = useGlobalContext();

  const handleNavigate = () => {
    setSelectedRowId(item.id);
    navigate(`/assets/${item.id}`);
  };

  const menuItems = [
    { id: "edit", label: "Edit", icon: Pencil, onClick: handleNavigate },
    { id: "view", label: "View", icon: Eye, onClick: handleNavigate },
    { id: "delete", label: "Delete", icon: Trash2, onClick: handleNavigate },
  ];

  return (
    <div
      className={cn(
        sharedStyles.cardRowParent,
        "flex flex-col overflow-visible",
        isOpen && sharedStyles.cardIsOpen, // Apply the cardIsOpen style when isOpen is true
      )}
      onClick={onToggle}
    >
      <div className={cn(sharedStyles.cardBtn, "gap-0")}>
        <div className={sharedStyles.mobileCardHeaderContent}>
          <CardRow
            value={item.equipment}
            // icon={Hammer}
            className="capitalize text-(--clr-textLight) py-0"
            valueStyles={sharedStyles.mobileCardTitle}
            iconStyles="w-4 h-4 text-purple-500 dark:text-purple-400"
          />
          <CardRow
            value={item.assetID}
            icon={Barcode}
            className="capitalize dark:text-(--clr-textDark) text-(--clr-textLight) py-0"
            valueStyles={sharedStyles.mobileCardMeta}
            iconStyles="w-3.5 h-3.5 text-teal-500 dark:text-teal-400"
          />
          <CardRow
            value={item.location}
            icon={MapPin}
            className="capitalize text-(--clr-textLight) py-0"
            valueStyles={sharedStyles.mobileCardMeta}
            iconStyles="w-3.5 h-3.5 text-blue-500 dark:text-blue-400"
          />
        </div>

        {/* Actions + chevron grouped on the right */}
        <div
          className={sharedStyles.mobileCardActions}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuButtonDialog menuItems={menuItems} />

          {/* Chevron — expand/collapse only */}
          <button type="button" onClick={onToggle}>
            <ChevronDown
              size={18}
              className={cn(
                sharedStyles.mobileCardChevron,
                isOpen && "rotate-180",
              )}
            />
          </button>
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
            <div className="mt-3 text-xs">
              <ul className="grid gap-4 text-gray-400">
                <li className="flex gap-2 w-full justify-between">
                  <span>Condition</span>
                  <span>{item.condition}</span>
                </li>
                <li className="flex gap-2 w-full justify-between">
                  <span>Serial Number</span>
                  <span>{item.serialNumber}</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// import type { AssetTableRow } from "@/schemas";
// import { ChevronDown } from "lucide-react";
// import type { Row } from "@tanstack/react-table";
// import { useNavigate } from "react-router-dom";
// import useGlobalContext from "@/context/useGlobalContext";

// type Props = {
//   row: Row<AssetTableRow>;
//   isOpen: boolean;
//   onToggle: () => void;
// };

// export function MobileAssetRegisterCard({ row, isOpen, onToggle }: Props) {
//   const navigate = useNavigate();
//   const { setSelectedRowId } = useGlobalContext();
//   return (
//     <div
//       className="hover:cursor-pointer dark:border rounded-md p-2 mb-2 bg-gray-100 dark:bg-(--bg-primary_dark)"
//       onClick={onToggle}
//     >
//       <div className="flex justify-between items-start dark:text-gray-400">
//         <p className="font-medium">{row.original.equipment}</p>
//         <ChevronDown
//           className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
//         />
//       </div>

//       <div className="flex justify-between text-xs mt-2 text-gray-500 dark:text-gray-400">
//         <span>{row.original.location}</span>
//         <span>{row.original.assetID}</span>
//       </div>

//       {isOpen && (
//         <div className="mt-3 text-xs grid gap-6">
//           <ul className="grid gap-4 text-gray-400">
//             <li className="flex gap-2 w-full justify-between">
//               <span>Condition</span>
//               <span>{row.original.condition}</span>
//             </li>
//             <li className="flex gap-2 w-full justify-between">
//               <span>Serial Number</span>
//               <span>{row.original.serialNumber}</span>
//             </li>
//           </ul>
//           <div className="w-full flex gap-12 justify-between mt-auto">
//             <button
//               type="button"
//               className="py-1 dark:text-gray-200 text-green-700 hover:cursor-pointer hover:text-green-700 bg-green-200/90 flex-1 rounded-full"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 // console.log(row.original.id);
//                 navigate(`/assets/${row.original.id}`);
//                 setSelectedRowId(row.original.id);
//               }}
//             >
//               Edit
//             </button>
//             <button
//               type="button"
//               className="py-2 dark:text-gray-200 text-yellow-600 hover:cursor-pointer hover:text-primary bg-primary/40 flex-1 rounded-full"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 console.log(row.original.id);
//                 navigate(`/assets/${row.original.id}`);
//                 setSelectedRowId(row.original.id);
//                 //   console.log(actionData);
//               }}
//             >
//               View
//             </button>
//             <button
//               type="button"
//               className="py-2 dark:text-gray-200 text-red-500 hover:cursor-pointer hover:text-red-500 bg-red-200/90 flex-1 rounded-full"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 console.log(row.original.id);
//                 navigate(`/assets/${row.original.id}`);
//                 setSelectedRowId(row.original.id);
//               }}
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
