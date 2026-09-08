// $ Displays asset equipment/ID — inline text for a single asset,
// or a dropdown listing all assets when there's more than one.

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { AssetItem } from "@/schemas/transfersSchemas";
import { ChevronDown, Package } from "lucide-react";

export function AssetsDropdownCell({ assets }: { assets: AssetItem[] }) {
  if (assets.length === 0) return <p>—</p>;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => e.stopPropagation()}
          className="gap-2 rounded-lg border border-emerald-200 bg-emerald-100 text-xs font-medium text-emerald-800 hover:bg-emerald-200 hover:text-emerald-900 hover:cursor-pointer dark:border-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200 dark:hover:bg-emerald-800 dark:hover:text-emerald-100 capitalize"
        >
          <Package className="size-3.5" aria-hidden="true" />
          {assets.length > 1
            ? `${assets.length} assets`
            : `${assets.length} asset`}
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 max-w-[calc(100vw-2rem)] rounded-xl border-slate-200 bg-white p-0 shadow-xl dark:border-(--clr-borderDark) dark:bg-(--bg-secondary_dark) dark:text-gray-100"
        align="start"
        sideOffset={8}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-800/40">
          <DropdownMenuLabel className="p-0 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Assets
          </DropdownMenuLabel>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium tabular-nums text-blue-800 ring-1 ring-blue-200 dark:bg-blue-800/60 dark:text-blue-200 dark:ring-blue-700">
            {assets.length}
          </span>
        </div>
        <DropdownMenuGroup className="max-h-72 overflow-y-auto overscroll-contain p-2">
          {assets.map((asset, index) => (
            <div
              key={`${asset.assetID ?? "unidentified"}-${index}`}
              className="flex items-start gap-3 rounded-lg px-2 py-3 even:bg-slate-50 dark:even:bg-slate-800/40"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500">
                <Package className="size-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium capitalize leading-5 text-slate-800 wrap-anywhere dark:text-slate-100">
                  {asset.equipment}
                </p>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs">
                  <span className="text-slate-400 dark:text-slate-500">
                    Asset ID
                  </span>
                  <span
                    className={
                      asset.assetID?.trim()
                        ? "font-mono text-slate-600 wrap-anywhere dark:text-slate-300"
                        : "text-amber-700 dark:text-amber-400"
                    }
                  >
                    {asset.assetID?.trim() || "Unidentified"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
