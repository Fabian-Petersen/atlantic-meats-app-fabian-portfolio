// $ Config for the color schema based on the priority evaluated in the component. Used within the Pendnig and Approved Requests components

export const priorityConfig: Record<
  string,
  { label: string; className: string }
> = {
  high: {
    label: "High",
    className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  },
  medium: {
    label: "Medium",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  },
  low: {
    label: "Low",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  },
};
