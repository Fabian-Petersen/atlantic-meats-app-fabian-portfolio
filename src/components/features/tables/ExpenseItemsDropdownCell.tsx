import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ReceiptText } from "lucide-react";
import type { ActionExpenseResponseValue } from "@/schemas/actionSchemas";

const currencyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 2,
});

function formatCost(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";

  const amount = Number(value);
  return Number.isFinite(amount) ? currencyFormatter.format(amount) : "-";
}

function normaliseItems(
  value: ActionExpenseResponseValue | null | undefined,
  total: string | number | null | undefined,
) {
  const rawItems = Array.isArray(value) ? value : value?.trim() ? [value] : [];

  // Older records store descriptions separately from one aggregate cost. Keep
  // those descriptions together so the available cost is shown accurately,
  // rather than displaying a misleading per-item value or an empty cost.
  if (rawItems.length > 0 && rawItems.every((item) => typeof item === "string")) {
    const descriptions = rawItems
      .map((item) => (item as string).trim())
      .filter(Boolean);

    return {
      items: descriptions.length
        ? [{ description: descriptions.join(", "), cost: total }]
        : [],
      itemCount: descriptions.length,
    };
  }

  const items = rawItems
    .map((item) =>
      typeof item === "string"
        ? { description: item.trim(), cost: total }
        : { description: item.description.trim(), cost: item.cost },
    )
    .filter((item) => item.description);

  return { items, itemCount: items.length };
}

export function ExpenseItemsDropdownCell({
  label,
  value,
  total,
}: {
  label: string;
  value: ActionExpenseResponseValue | null | undefined;
  total: string | number | null | undefined;
}) {
  const { items, itemCount } = normaliseItems(value, total);

  if (items.length === 0) return <p>-</p>;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          onClick={(event) => event.stopPropagation()}
          className="gap-2 rounded-lg border border-blue-200 bg-blue-50 text-xs font-medium text-blue-800 transition-none hover:cursor-pointer hover:bg-blue-100 hover:text-blue-900 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200 dark:hover:bg-blue-900"
        >
          <ReceiptText className="size-3.5" aria-hidden="true" />
          {label} ({itemCount})
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        onClick={(event) => event.stopPropagation()}
        className="w-80 max-w-[calc(100vw-2rem)] rounded-xl border-slate-200 bg-white p-0 shadow-xl dark:border-(--clr-borderDark) dark:bg-(--bg-secondary_dark) dark:text-gray-100"
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-800/40">
          <DropdownMenuLabel className="p-0 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {label}
          </DropdownMenuLabel>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium tabular-nums text-blue-800 ring-1 ring-blue-200 dark:bg-blue-800/60 dark:text-blue-200 dark:ring-blue-700">
            {itemCount}
          </span>
        </div>
        <DropdownMenuGroup className="max-h-72 overflow-y-auto overscroll-contain p-2">
          {items.map((item, index) => (
            <div
              key={`${item.description}-${index}`}
              className="flex items-start justify-between gap-4 rounded-lg px-2 py-3 even:bg-slate-50 dark:even:bg-slate-800/40"
            >
              <span className="min-w-0 text-sm capitalize text-slate-800 wrap-anywhere dark:text-slate-100">
                {item.description}
              </span>
              <span className="shrink-0 text-sm font-medium tabular-nums text-slate-600 dark:text-slate-300">
                {formatCost(item.cost)}
              </span>
            </div>
          ))}
        </DropdownMenuGroup>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 dark:border-slate-700/60">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total
          </span>
          <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {formatCost(total)}
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
