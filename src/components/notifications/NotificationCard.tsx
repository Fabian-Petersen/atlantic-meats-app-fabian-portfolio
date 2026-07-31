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
import { usePOST, useUpdateItem } from "@/utils/api";
import { useDeleteItem } from "@/utils/api";
import { formatNotificationDate } from "@/utils/formatNotificationDate";

type NotificationCardProps = {
  row: Notification;
  onRemove?: (id: string) => void;
};

export default function NotificationCard({
  row,
  onRemove,
}: NotificationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState(row.status);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // $ Update the status from "UNREAD" to "READ"
  const { mutateAsync: updateStatus } = usePOST({
    resourcePath: "api/notifications",
    queryKey: ["notifications", "user-notifications"],
  });

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

  // Close the menu on outside click
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

  const handleToggle = async () => {
    const willExpand = !isExpanded;
    setIsExpanded(willExpand);

    if (willExpand && status === "UNREAD") {
      setStatus("READ");
      try {
        await updateStatus({ ...basePayload, status: "READ" });
      } catch (error) {
        console.log("notification:", error);
        setStatus("UNREAD");
      }
    }
  };

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
    // if (!window.confirm("Delete this notification? This can't be undone.")) {
    //   return;
    // }
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
        aria-expanded={isExpanded}
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
              className={`text-sm dark:text-gray-200 ${
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
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Details — only rendered once the card is expanded */}
        {isExpanded && (
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
