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
    <div className="rounded-md dark:bg-(--bg-primary_dark)">
      <button
        type="button"
        onClick={() => onToggle(category)}
        aria-expanded={!isCollapsed}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors hover:cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-gray-600 dark:text-gray-400 uppercase">
            {CATEGORY_LABELS[category]}
          </span>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-blue-500 text-white text-[10px] font-medium">
              {unreadCount}
            </span>
          )}
        </div>

        {isCollapsed ? (
          <Plus size={14} className="text-gray-600" />
        ) : (
          <Minus size={14} className="text-gray-600" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className=""
          >
            <div className="md:px-2 pb-2 space-y-2">
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
