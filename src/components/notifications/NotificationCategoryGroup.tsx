// NotificationCategoryGroup.tsx
import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Notification } from "@/schemas";
import NotificationCard from "./NotificationCard";
import {
  CATEGORY_LABELS,
  type NotificationCategory,
} from "@/utils/notificationCategory";
import { useState } from "react";

type NotificationCategoryGroupProps = {
  category: NotificationCategory;
  notifications: Notification[];
  unreadCount: number;
  isCollapsed: boolean;
  onToggle: (category: NotificationCategory) => void;
  onMarkAsRead: (notification: Notification) => Promise<void>;
  userId: string;
};

export default function NotificationCategoryGroup({
  category,
  notifications,
  unreadCount,
  isCollapsed,
  onToggle,
  onMarkAsRead,
}: NotificationCategoryGroupProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (notifications.length === 0) return null;

  const handleToggle = (id: string) =>
    setOpenId((current) => (current === id ? null : id));

  return (
    <div className="py-1.5">
      <button
        type="button"
        onClick={() => onToggle(category)}
        aria-expanded={!isCollapsed}
        className="flex w-full items-center justify-between rounded-md px-2 py-2 transition-colors hover:cursor-pointer hover:bg-gray-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-white/5"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
            {CATEGORY_LABELS[category]}
          </span>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
              {unreadCount}
            </span>
          )}
        </div>

        {isCollapsed ? (
          <Plus size={15} className="text-gray-400" />
        ) : (
          <Minus size={15} className="text-gray-400" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pb-1">
              {notifications.map((item) => (
                <NotificationCard
                  key={item.id}
                  row={item}
                  isOpen={openId === item.id}
                  onToggle={handleToggle}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
