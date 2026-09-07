import { useState } from "react";
import { flexRender, type Row } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { DisposalCompletedTableRow } from "@/components/tableColumns/DisposalCompletedColumns";
import { CardRow } from "@/components/mobile/CardRow";
import { sharedStyles } from "@/styles/shared";
import { motionVariants } from "@/styles/motionStyles";
import { cn } from "@/lib/utils";

export default function MobileDisposalsCompletedList({
  data,
  className,
}: {
  data: Row<DisposalCompletedTableRow>[];
  className?: string;
}) {
  const [openRowId, setOpenRowId] = useState<string | null>(null);

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {data.map((row) => {
        const isOpen = openRowId === row.original.id;
        const cells = row.getVisibleCells();
        const renderCell = (id: string) => {
          const cell = cells.find((cell) => cell.column.id === id);
          return cell && flexRender(cell.column.columnDef.cell, cell.getContext());
        };

        return (
          <div key={row.original.id} className={cn(sharedStyles.cardRowParent, "flex flex-col", isOpen && sharedStyles.cardIsOpen)}>
            <div className="flex items-center justify-between gap-2 w-full">
              <button type="button" className="flex items-center justify-between gap-2 flex-1 min-w-0 text-left" aria-expanded={isOpen} onClick={() => setOpenRowId(isOpen ? null : row.original.id)}>
                <div className="flex flex-col min-w-0 gap-1">
                  <div className="text-sm font-semibold capitalize">{renderCell("equipment")}</div>
                  <div className="text-xs text-gray-500">{renderCell("assetID")}</div>
                  <div className="text-xs capitalize">{row.original.disposalMethod}</div>
                </div>
                <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
              </button>
              {renderCell("status")}
              {renderCell("actions")}
            </div>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div variants={motionVariants.expandable} initial="closed" animate="open" exit="closed" className="overflow-hidden">
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex flex-col gap-2">
                    {cells.filter((cell) => !["equipment", "assetID", "status", "actions"].includes(cell.column.id)).map((cell) => (
                      <CardRow key={cell.id} label={typeof cell.column.columnDef.header === "string" ? cell.column.columnDef.header : cell.column.id === "disposedDate" ? "Disposed Date" : "Date Created"}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </CardRow>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
