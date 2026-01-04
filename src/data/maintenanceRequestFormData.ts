export const priority: string[] = ["Critical", "High", "Medium", "Low"];
export type Priority = (typeof PRIORITIES)[number];
export const PRIORITIES = ["Critical", "High", "Medium", "Low"] as const;

export const priorityColors: Record<Priority, { bg: string; text: string }> = {
  Critical: {
    bg: "bg-red-600",
    text: "text-white",
  },
  High: {
    bg: "bg-orange-500",
    text: "text-white",
  },
  Medium: {
    bg: "bg-yellow-400",
    text: "text-gray-900",
  },
  Low: {
    bg: "bg-green-500",
    text: "text-white",
  },
};

export const type: string[] = ["corrective", "preventative", "legislative"];
export const impact: string[] = ["production", "safety", "compliance"];

export const stores: string[] = [
  "Phillipi",
  "Bellville",
  "Khayelitsha",
  "Wynberg",
];
