import { useState } from "react";
import { flexRender, type Row } from "@tanstack/react-table";
import { Calendar, ChevronDown, MapPin } from "lucide-react";
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
          return (
            cell && flexRender(cell.column.columnDef.cell, cell.getContext())
          );
        };

        return (
          <div
            key={row.original.id}
            className={cn(
              sharedStyles.cardRowParent,
              "flex flex-col",
              isOpen && sharedStyles.cardIsOpen,
            )}
          >
            <div className={sharedStyles.mobileCardHeader}>
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpenRowId(isOpen ? null : row.original.id)}
              >
                <div className={sharedStyles.mobileCardHeaderContent}>
                  <div
                    className={cn(
                      sharedStyles.mobileCardTitle,
                      "flex items-center gap-1.5",
                    )}
                  >
                    <MapPin className="size-3.5 shrink-0 text-blue-500" />
                    <span className="truncate">
                      {row.original.pending.location || "Unknown"}
                    </span>
                  </div>
                  <div
                    className={cn(
                      sharedStyles.mobileCardMeta,
                      "flex items-center gap-1.5",
                    )}
                  >
                    <Calendar className="size-3.5 shrink-0 text-teal-500" />
                    <span className="truncate">
                      {renderCell("disposalCreated")}
                    </span>
                  </div>
                </div>
              </button>
              <div className={sharedStyles.mobileCardActions}>
                {renderCell("status")}
                {renderCell("actions")}
                <button
                  type="button"
                  aria-label={isOpen ? "Collapse disposal" : "Expand disposal"}
                  aria-expanded={isOpen}
                  onClick={() => setOpenRowId(isOpen ? null : row.original.id)}
                >
                  <ChevronDown
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
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex flex-col gap-2">
                    {cells
                      .filter(
                        (cell) =>
                          ![
                            "disposalCreated",
                            "disposalLocation",
                            "status",
                            "actions",
                          ].includes(cell.column.id),
                      )
                      .map((cell) => (
                        <CardRow
                          key={cell.id}
                          label={
                            typeof cell.column.columnDef.header === "string"
                              ? cell.column.columnDef.header
                              : cell.column.id === "disposedDate"
                                ? "Disposed Date"
                                : "Date Created"
                          }
                        >
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </div>
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
