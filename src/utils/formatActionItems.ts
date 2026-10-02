/** Formats legacy scalar and current array action-expense values for display. */
export function formatActionItems(
  value: string | string[] | null | undefined,
): string | null {
  if (Array.isArray(value)) {
    const items = value.map((item) => item.trim()).filter(Boolean);
    return items.length > 0 ? items.join(", ") : null;
  }

  const item = value?.trim();
  return item || null;
}
