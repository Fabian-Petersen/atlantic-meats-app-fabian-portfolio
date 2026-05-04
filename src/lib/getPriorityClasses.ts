export type Priority = "critical" | "high" | "medium" | "low";

/**
 * Returns Tailwind CSS classes for styling a priority badge based on severity level.
 *
 * Each priority level maps to a distinct color scheme:
 * - critical: red (highest urgency)
 * - high: orange
 * - medium: blue
 * - low: green
 *
 * A shared base style is applied to ensure consistent badge shape, sizing,
 * and layout across all priority types.
 *
 * This function is typically used in table column cell renderers to visually
 * indicate the importance or urgency of a record.
 *
 * Example usage in a table cell:
 *
 * cell: ({ getValue }) => {
 *   const value = getValue<string>();
 *   return (
 *     <p className={`capitalize text-cxs ${getPriorityClasses(value as Priority)}`}>
 *       {value}
 *     </p>
 *   );
 * }
 *
 * @param priority - The priority level to style ("critical" | "high" | "medium" | "low")
 * @returns A string of Tailwind CSS classes for styling the priority badge
 */

export function getPriorityClasses(priority: Priority) {
  const generalStyles =
    "border min-w-12 w-fit rounded-full max-w-fit p-[0.135rem] text-center px-[0.40rem]";
  switch (priority.toLocaleLowerCase()) {
    case "critical":
      return `text-red-600 bg-red-300/30 border-red-300 dark:border-red-500 dark:bg-red-300/20 dark:text-red-300 ${generalStyles}`;
    case "high":
      return `text-orange-600 bg-orange-300/30 border-orange-300  dark:border-orange-500 dark:bg-orange-300/20 dark:text-orange-300 ${generalStyles}`;
    case "medium":
      return `text-blue-600 bg-blue-300/30 border-blue-300 dark:border-blue-500 dark:bg-blue-300/20 dark:text-blue-300 ${generalStyles}`;
    case "low":
      return `text-green-600 bg-green-300/30 border-green-300 dark:border-green-500 dark:bg-green-300/20 dark:text-green-300 ${generalStyles}`;
    default:
      return `text-gray-400 bg-gray-100 border border-gray-500 ${generalStyles}`;
  }
}
