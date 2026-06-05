import { useState, useRef, useEffect } from "react";
import type { AssetTableRow } from "@/schemas";
import { ChevronDown, MoreVertical, Pencil, Eye, Trash2 } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";

type Props = {
  row: Row<AssetTableRow>;
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileAssetViewRow({ row, isOpen, onToggle }: Props) {
  const navigate = useNavigate();
  const { setSelectedRowId } = useGlobalContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    setSelectedRowId(row.original.id);
    navigate(`/assets/${row.original.id}`);
  };

  return (
    <div
      className="hover:cursor-pointer dark:border rounded-md p-2 mb-2 bg-gray-100 dark:bg-(--bg-primary_dark) dark:border-gray-700"
      onClick={onToggle}
    >
      <div className="flex justify-between items-start dark:text-gray-400">
        <p className="font-medium">{row.original.equipment}</p>

        {/* Actions + chevron grouped on the right */}
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Kebab menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Asset actions"
            >
              <MoreVertical size={18} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-10 min-w-37.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                <button
                  type="button"
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left text-green-700 dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={handleNavigate}
                >
                  <Pencil size={15} /> Edit
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={handleNavigate}
                >
                  <Eye size={15} /> View
                </button>
                <div className="h-px bg-gray-100 dark:bg-gray-700" />
                <button
                  type="button"
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={handleNavigate}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            )}
          </div>

          {/* Chevron — expand/collapse only */}
          <ChevronDown
            size={18}
            className={`text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs mt-2 text-gray-500 dark:text-gray-400">
        <span>{row.original.location}</span>
        <span>{row.original.assetID}</span>
      </div>

      {isOpen && (
        <div className="mt-3 text-xs">
          <ul className="grid gap-4 text-gray-400">
            <li className="flex gap-2 w-full justify-between">
              <span>Condition</span>
              <span>{row.original.condition}</span>
            </li>
            <li className="flex gap-2 w-full justify-between">
              <span>Serial Number</span>
              <span>{row.original.serialNumber}</span>
            </li>
          </ul>
        </div>
      )}
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

// export function MobileAssetViewRow({ row, isOpen, onToggle }: Props) {
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
