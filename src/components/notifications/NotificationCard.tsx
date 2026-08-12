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
  }, [isOpen]);

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
      className={`group relative rounded-md bg-white dark:bg-(--bg-primary_dark) mb-2 transition-shadow hover:shadow-sm border ${
        status === "UNREAD"
          ? "border-l-4 border-l-blue-500 border-blue-400 dark:border-l-blue-500"
          : status === "READ"
            ? "border-l-4 border-l-gray-300 dark:border-l-gray-400 border-gray-200 dark:border-(--clr-borderDark)"
            : "border-gray-200 dark:border-(--clr-borderDark)"
      }`}
    >
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
        className="hover:cursor-pointer w-full text-left px-4 py-3 flex flex-col hover:bg-gray-50 dark:hover:bg-white/5 transition-colors space-y-4 rounded-md"
      >
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex justify-between gap-2 min-w-0 w-full flex-col">
            <span
              className={`text-xs dark:text-gray-200 ${
                status === "UNREAD" ? "font-semibold" : "font-medium"
              }`}
            >
              {row.title}
            </span>

            <CardRow
              icon={Calendar}
              value={formatNotificationDate(row.notificationCreated)}
              className="py-0"
              valueStyles="lowercase text-gray-400"
              iconStyles="w-3.5 h-3.5 text-green-400 dark:text-green-500"
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
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:cursor-pointer"
                >
                  <MoreVertical size={15} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-36 rounded-md bg-white dark:bg-(--bg-primary_dark) border border-gray-200 dark:border-(--clr-borderDark) shadow-lg z-9000 overflow-hidden">
                    <button
                      type="button"
                      onClick={handleArchive}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:cursor-pointer text-left"
                    >
                      <Archive size={13} />
                      Archive
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:cursor-pointer text-left"
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
              className={`text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Details — only rendered once the card is expanded */}
        {isOpen && (
          <div className="space-y-2">
            {row.location && (
              <CardRow
                icon={MapPin}
                value={row.location}
                valueStyles="text-sm dark:text-white"
                iconStyles="text-green-500"
                className="py-0"
              />
            )}
            {row.message && (
              <CardRow value={row.message} className="w-full py-0" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
