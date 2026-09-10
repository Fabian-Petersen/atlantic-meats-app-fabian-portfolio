import { ChevronDown, Package, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

type AssetSectionHeaderProps = {
  assetNumber: number;
  isOpen: boolean;
  summary: string;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
};

/** Shared collapsible heading for asset blocks in multi-asset forms. */
export function AssetSectionHeader({
  assetNumber,
  isOpen,
  summary,
  onToggle,
  onRemove,
  canRemove,
}: AssetSectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-t-md px-3 py-3 transition-colors sm:px-4",
        isOpen
          ? "bg-gray-50/80 dark:bg-gray-800/35"
          : "hover:bg-gray-50/70 dark:hover:bg-gray-800/25",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? "Collapse" : "Expand"} asset ${assetNumber}`}
        className="group flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/15 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20">
          <Package className="size-4.5" aria-hidden="true" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Asset
            </span>
            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-gray-900 px-2 py-0.5 text-[0.65rem] font-semibold tabular-nums text-white dark:bg-gray-100 dark:text-gray-900">
              {assetNumber}
            </span>
          </span>
          <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
            {isOpen ? "Equipment and identification details" : summary}
          </span>
        </span>

        <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors group-hover:bg-white group-hover:text-gray-700 dark:group-hover:bg-gray-700 dark:group-hover:text-gray-200">
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </span>
      </button>

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove asset ${assetNumber}`}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
