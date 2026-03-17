// $ This function take in an arguement "targetDate" and return true or false. The outcome is used in the table components to highlight overdure jobs in red.

export function isTargetDateOverdue(targetDate: string) {
  if (!targetDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parsedTargetDate = new Date(targetDate);
  if (isNaN(parsedTargetDate.getTime())) return false;

  parsedTargetDate.setHours(0, 0, 0, 0);

  return parsedTargetDate < today;
}
