// $ ─── Badge Component ────────────────────────────────────────────────────────────
export function Badge({
  value,
  styleMap,
}: {
  value: string;
  styleMap: Record<string, string>;
}) {
  const key = value?.toLowerCase();
  const cls =
    styleMap[key] ??
    "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${cls}`}
    >
      {value}
    </span>
  );
}
