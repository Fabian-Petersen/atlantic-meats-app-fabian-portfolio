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
    <div className="flex items-center gap-4 border-b border-gray-200 dark:border-(--clr-borderDark) px-2 mb-2">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const count = counts?.[tab.key] ?? 0;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "relative pb-2 text-sm w-16 hover:cursor-pointer transition-colors max-w-18",
              isActive
                ? "text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
            )}
          >
            {tab.label}
            {count > 0 && (
              <span
                className={cn(
                  "ml-2 text-xs",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400",
                )}
              >
                {tab.label.toLowerCase() === "all" ? (
                  <span className="bg-blue-500 rounded-sm px-1 py-0.5 text-white">
                    {count}
                  </span>
                ) : (
                  <span className="bg-blue-100 rounded-sm px-1 py-0.5 text-blue-500">
                    {count}
                  </span>
                )}
              </span>
            )}
            {isActive && (
              <span className="w-full absolute left-0 right-0 -bottom-px h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
