import { useState } from "react";
import { MapPin, Calendar, NotebookPen, ChevronDown } from "lucide-react";
import type { Notification, NotificationPayload } from "@/schemas";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { CardRow } from "../mobile/CardRow";
import { usePOST } from "@/utils/api";

type NotificationCardProps = {
  row: Notification;
  userId: string;
};

export default function NotificationCard({
  row,
  userId,
}: NotificationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Local copy of status so the card can reflect "READ" immediately
  // without the row disappearing from the list (see notes below).
  const [status, setStatus] = useState(row.status);

  // IMPORTANT: do not pass a queryKey here that triggers an invalidation/refetch
  // of the notifications list — that's what would make the card vanish/reorder
  // as soon as it's marked read. Let the parent list re-filter on its own next
  // natural fetch (page load / revisit) instead.
  const { mutateAsync: updateStatus } = usePOST({
    resourcePath: "api/notifications",
    queryKey: ["notifications", "user-notifications"],
  });

  const payload: NotificationPayload = {
    id: row.id,
    recipientSub: userId,
    notificationCreated: row.notificationCreated,
    status: "READ",
  };

  const handleToggle = async () => {
    const willExpand = !isExpanded;
    setIsExpanded(willExpand);

    // Only fire the update the first time it's opened, and only if it
    // was actually unread.
    if (willExpand && status === "UNREAD") {
      setStatus("READ"); // optimistic — updates the left border immediately
      try {
        await updateStatus(payload);
      } catch (error) {
        console.log("notification:", error);
        setStatus("UNREAD"); // revert on failure
      }
    }
  };

  return (
    <div
      className={`rounded-md bg-white dark:bg-(--bg-primary_dark) mb-2 overflow-hidden transition-shadow hover:shadow-sm border ${
        status === "UNREAD"
          ? "border-l-4 border-l-blue-500 border-blue-400 dark:border-l-blue-500"
          : status === "READ"
            ? "border-l-4 border-l-gray-300 dark:border-l-gray-400 border-gray-200 dark:border-(--clr-borderDark)"
            : "border-gray-200 dark:border-(--clr-borderDark)"
      }`}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        className="hover:cursor-pointer w-full text-left px-4 py-3 flex flex-col hover:bg-gray-50 dark:hover:bg-white/5 transition-colors space-y-4"
      >
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            <span
              className={`text-sm dark:text-gray-200 ${
                status === "UNREAD" ? "font-semibold" : "font-medium"
              }`}
            >
              {row.title}
            </span>

            {/* Date */}
            <CardRow
              icon={Calendar}
              value={row.notificationCreatedDisplay}
              className="py-0"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge
              value={row.priority}
              styleMap={badgeStyles.families.notification}
              className={badgeStyles.base}
            />

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
              <CardRow
                icon={NotebookPen}
                value={row.message}
                className="w-full py-0"
              />
            )}
          </div>
        )}
      </button>
    </div>
  );
}

// import { MapPin, Calendar, NotebookPen } from "lucide-react";
// import type { Notification, NotificationPayload } from "@/schemas";
// // import { useNavigate } from "react-router-dom";
// import { Badge } from "../features/Badge";
// import { badgeStyles } from "@/styles/badgeStyles";
// import { CardRow } from "../mobile/CardRow";
// // import { usePOST } from "@/utils/api";

// type NotificationCardProps = {
//   row: Notification;
//   userId: string;
// };

// export default function NotificationCard({
//   row,
//   userId,
// }: NotificationCardProps) {
//   // const { mutateAsync: updateStatus } = usePOST({
//   //   resourcePath: "api/notifications",
//   //   queryKey: ["notifications", "user-notifications"],
//   // });

//   const payload: NotificationPayload = {
//     id: row.id,
//     recipientSub: userId,
//     notificationCreated: row.notificationCreated,
//     status: "READ",
//   };

//   const handleOpen = async (payload: NotificationPayload) => {
//     console.log(payload);
//     // try {
//     //   await updateStatus(payload);
//     // } catch (error) {
//     //   console.log("notification:", error);
//     // }
//   };

//   return (
//     <div
//       className={`rounded-md bg-white dark:bg-(--bg-primary_dark) mb-2 overflow-hidden transition-shadow hover:shadow-sm border ${
//         row.status === "UNREAD"
//           ? "border-l-4 border-l-blue-500 border-gray-200  dark:border-(--clr-borderDark) dark:border-l-blue-500"
//           : row.status === "READ"
//             ? "border-l-4 border-l-green-500"
//             : "border-gray-200 dark:border-(--clr-borderDark)"
//       }`}
//     >
//       <button
//         type="button"
//         onClick={() => handleOpen(payload)}
//         className="hover:cursor-pointer w-full text-left px-4 py-3 flex flex-col hover:bg-gray-50 dark:hover:bg-white/5 transition-colors space-y-4"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-start gap-4">
//           <div className="flex flex-col gap-2 min-w-0">
//             <span className="font-medium text-sm dark:text-white">
//               {row.title}
//             </span>

//             {/* Date */}
//             <CardRow
//               icon={Calendar}
//               value={row.notificationCreatedDisplay}
//               className="py-0"
//             />
//           </div>

//           <div className="flex items-center gap-2 shrink-0">
//             {/* {row.status === "UNREAD" && (
//               <span
//                 className="h-2.5 w-2.5 rounded-full bg-blue-500"
//                 title="Unread"
//               />
//             )} */}

//             <Badge
//               value={row.priority}
//               styleMap={badgeStyles.families.notification}
//               className={badgeStyles.base}
//             />
//           </div>
//         </div>

//         {/* Only render location if present */}
//         {row.location && (
//           <CardRow
//             icon={MapPin}
//             value={row.location}
//             valueStyles="text-sm dark:text-white"
//             iconStyles="text-green-500"
//             className="py-0"
//           />
//         )}
//         {/* Message */}
//         {row.message && (
//           <CardRow
//             icon={NotebookPen}
//             value={row.message}
//             className="w-full py-0"
//           />
//         )}
//       </button>
//     </div>
//   );
// }
