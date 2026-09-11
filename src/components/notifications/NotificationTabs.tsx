// NotificationTabs.tsx
import { cn } from "@/lib/utils";

export type NotificationTab = "unread" | "all";

type NotificationCounts = {
  all: number;
  unread: number;
  read: number;
  archived: number;
};

type NotificationTabsProps = {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
  counts?: NotificationCounts;
};

const TABS: { key: NotificationTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
];

export default function NotificationTabs({
  activeTab,
  onTabChange,
  counts,
}: NotificationTabsProps) {
  return (
    <div className="grid grid-cols-2 rounded-lg bg-gray-100 p-1 dark:bg-white/5">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const count = counts?.[tab.key] ?? 0;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "flex min-h-9 items-center justify-center gap-2 rounded-md px-3 text-xs font-medium transition-all duration-200 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              isActive
                ? "bg-white text-gray-900 shadow-sm dark:bg-white/10 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200",
            )}
          >
            {tab.label}
            {count > 0 && (
              <span
                className={cn(
                  "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] leading-none",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-300",
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
