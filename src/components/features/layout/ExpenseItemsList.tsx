import type { ActionExpenseResponseValue } from "@/schemas/actionSchemas";

const currencyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 2,
});

function formatValue(
  value: string | number | null | undefined,
  unit?: string,
) {
  if (value === null || value === undefined || value === "") return "-";

  const amount = Number(value);
  if (!Number.isFinite(amount)) return "-";

  return unit
    ? `${amount.toLocaleString("en-ZA")} ${unit}`
    : currencyFormatter.format(amount);
}

function getExpenseItems(
  value: ActionExpenseResponseValue | null | undefined,
  total: string | number | null | undefined,
) {
  if (!value) return [];

  const values = Array.isArray(value) ? value : [value];

  if (values.every((item) => typeof item === "string")) {
    const description = values
      .map((item) => (item as string).trim())
      .filter(Boolean)
      .join(", ");

    return description ? [{ description, cost: total }] : [];
  }

  return values
    .map((item) =>
      typeof item === "string"
        ? { description: item.trim(), cost: total }
        : { description: item.description.trim(), cost: item.cost },
    )
    .filter((item) => item.description);
}

function ExpenseItemsList({
  label,
  value,
  total,
  unit,
}: {
  label: string;
  value: ActionExpenseResponseValue | null | undefined;
  total: string | number | null | undefined;
  unit?: string;
}) {
  const items = getExpenseItems(value, total);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700/60 dark:bg-gray-800/60">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700/60">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
          {label}
        </p>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-300">
          {items.length}
        </span>
      </div>

      <div className="divide-y divide-gray-100 px-4 dark:divide-gray-700/60">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={`${item.description}-${index}`}
              className="flex items-start justify-between gap-4 py-3"
            >
              <span className="min-w-0 text-xs font-medium capitalize text-gray-700 wrap-anywhere dark:text-gray-200">
                {item.description}
              </span>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                {formatValue(item.cost, unit)}
              </span>
            </div>
          ))
        ) : (
          <p className="py-3 text-xs text-gray-400 dark:text-gray-500">-</p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 bg-white/70 px-4 py-3 dark:border-gray-700/60 dark:bg-gray-900/20">
        <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
        <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {formatValue(total, unit)}
        </span>
      </div>
    </div>
  );
}

export default ExpenseItemsList;
