import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Calendar,
  ChevronDown,
  MoreVertical,
  Archive,
  Trash2,
} from "lucide-react";
import type { Notification } from "@/schemas";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { CardRow } from "../mobile/CardRow";
import { useUpdateItem } from "@/utils/api";
import { useDeleteItem } from "@/utils/api";
import { formatNotificationDate } from "@/utils/formatNotificationDate";
import { AnimatePresence, motion } from "framer-motion";

type NotificationCardProps = {
  row: Notification;
  onRemove?: (id: string) => void;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onMarkAsRead: (notification: Notification) => Promise<void>;
};

export default function NotificationCard({
  row,
  onRemove,
  isOpen,
  onToggle,
  onMarkAsRead,
}: NotificationCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const wasOpenedRef = useRef(false);

  // $ Dropdown Menu: Action functions
  const { mutateAsync: archiveItem } = useUpdateItem({
    resourcePath: "api/notifications",
    queryKey: ["notifications", "user-notifications"],
  });

  const { mutateAsync: deleteNotification } = useDeleteItem({
    resourcePath: "api/notifications",
    queryKey: ["notifications", "user-notifications"],
  });

  const basePayload = {
    id: row.id,
    recipientSub: row.recipientSub,
    notificationCreated: row.notificationCreated,
  };

  // $ Close the menu on outside click
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // $ Mark notification as READ when the card is closed
  useEffect(() => {
    if (isOpen) {
      wasOpenedRef.current = true;
      return;
    }

    if (wasOpenedRef.current && row.status === "UNREAD") {
      wasOpenedRef.current = false;

      onMarkAsRead(row).catch((error) => {
        console.log("notification:", error);
      });
    }
  }, [isOpen, onMarkAsRead, row]);

  const handleToggle = () => onToggle(row.id);

  // $ Dropdown Menu Actions: Archive and Delete Notification
  const handleMenuButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsRemoving(true);
    try {
      await archiveItem({
        id: row.id,
        payload: { ...basePayload, status: "ARCHIVED" },
      });
      onRemove?.(row.id);
    } catch (error) {
      console.log("notification archive:", error);
      setIsRemoving(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsRemoving(true);
    try {
      await deleteNotification({
        id: row.id,
        payload: {
          notificationCreated: row.notificationCreated,
        },
      });
      onRemove?.(row.id);
    } catch (error) {
      console.log("notification delete:", error);
      setIsRemoving(false);
    }
  };

  if (isRemoving) return null;

  return (
    <div
      className={`group relative overflow-visible rounded-xl border bg-white shadow-xs transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-md dark:bg-(--bg-primary_dark) ${
        row.status === "UNREAD"
          ? "border-blue-200 ring-1 ring-blue-500/10 dark:border-blue-500/40"
          : row.status === "READ"
            ? "border-gray-200 dark:border-(--clr-borderDark)"
            : "border-gray-200 dark:border-(--clr-borderDark)"
      }`}
    >
      {row.status === "UNREAD" && (
        <span className="absolute left-0 top-4 h-8 w-0.5 rounded-r-full bg-blue-500" />
      )}
      <div
        role="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        className="w-full rounded-xl px-3.5 py-3 text-left transition-colors hover:cursor-pointer hover:bg-gray-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:hover:bg-white/5"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span
              className={`truncate text-sm leading-5 text-gray-800 dark:text-gray-100 ${
                row.status === "UNREAD" ? "font-semibold" : "font-medium"
              }`}
            >
              {row.title}
            </span>

            <CardRow
              icon={Calendar}
              value={formatNotificationDate(row.notificationCreated)}
              className="py-0"
              valueStyles="lowercase text-[11px] text-gray-400 dark:text-gray-500"
              iconStyles="size-3.5 text-gray-400 dark:text-gray-500"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {row.priority.toLowerCase() !== "normal" ? (
              <Badge
                value={row.priority}
                styleMap={badgeStyles.families.notification}
                className={badgeStyles.base}
              />
            ) : (
              ""
            )}

            {status !== "UNREAD" && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={handleMenuButtonClick}
                  aria-label="Notification options"
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                  className="grid size-7 place-items-center rounded-md text-gray-400 transition-colors hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-white/10 dark:hover:text-gray-200"
                >
                  <MoreVertical size={15} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-full z-9000 mt-1.5 w-36 overflow-visible rounded-lg border border-gray-200 bg-white p-1 shadow-xl dark:border-(--clr-borderDark) dark:bg-(--bg-primary_dark)">
                    <button
                      type="button"
                      onClick={handleArchive}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-gray-600 transition-colors hover:cursor-pointer hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                    >
                      <Archive size={13} />
                      Archive
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-red-500 transition-colors hover:cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}

            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Details — only rendered once the card is expanded */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 dark:border-white/10">
                {row.location && (
                  <CardRow
                    icon={MapPin}
                    value={row.location}
                    valueStyles="text-xs text-gray-600 dark:text-gray-300"
                    iconStyles="size-3.5 text-blue-500"
                    className="py-0"
                  />
                )}
                {row.message && (
                  <CardRow
                    value={row.message}
                    className="w-full py-0 text-xs leading-relaxed text-gray-600 dark:text-gray-300"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
