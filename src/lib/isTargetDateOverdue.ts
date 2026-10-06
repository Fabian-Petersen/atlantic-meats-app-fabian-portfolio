export type TargetDateStatus =
  | "overdue"
  | "due-today"
  | "upcoming"
  | "invalid";

export function getTargetDateStatus(targetDate: string): TargetDateStatus {
  if (!targetDate) return "invalid";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parsedTargetDate = new Date(targetDate);
  if (isNaN(parsedTargetDate.getTime())) return "invalid";

  parsedTargetDate.setHours(0, 0, 0, 0);

  if (parsedTargetDate < today) return "overdue";
  if (parsedTargetDate.getTime() === today.getTime()) return "due-today";

  return "upcoming";
}

// $ This function takes a targetDate and returns whether the job is overdue.

export function isTargetDateOverdue(targetDate: string) {
  return getTargetDateStatus(targetDate) === "overdue";
}
