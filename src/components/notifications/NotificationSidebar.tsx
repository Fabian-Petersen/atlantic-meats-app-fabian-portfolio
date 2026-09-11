import useGlobalContext from "@/context/useGlobalContext";
import { useGetAll, usePOST } from "@/utils/api";
import NotificationCategoryGroup from "./NotificationCategoryGroup";
import NotificationTabs, { type NotificationTab } from "./NotificationTabs";
import type { NotificationResponse, Notification } from "@/schemas";
import {
  getNotificationCategory,
  type NotificationCategory,
} from "@/utils/notificationCategory";
import { X } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { useMemo, useState } from "react";

const NotificationSidebar = () => {
  const { openNotificationSidebar, setOpenNotificationSidebar, userId } =
    useGlobalContext();

  const [activeTab, setActiveTab] = useState<NotificationTab>("unread");
  const [collapsedCategories, setCollapsedCategories] = useState<
    Set<NotificationCategory>
  >(new Set());

  const { data } = useGetAll<NotificationResponse>({
    queryKey: ["notifications", "user-notifications"],
    resourcePath: "api/notifications",
    params: {
      id: userId,
    },
  });

  // $ Update the status from "UNREAD" to "READ"
  const { mutateAsync: updateStatus } = usePOST({
    resourcePath: "api/notifications",
    queryKey: ["notifications", "user-notifications"],
  });

  const unreadList = useMemo(() => data?.notifications?.unread ?? [], [data]);

  const statusFilteredList = useMemo(
    () => data?.notifications?.[activeTab] ?? [],
    [data, activeTab],
  );

  // console.log("notifications:", data);
  // console.log("filteredList:", statusFilteredList);

  // Unread count per category — shown as the badge regardless of which
  // status tab is active, since it represents "how many new" per group.
  const unreadCountByCategory = useMemo(() => {
    const counts = new Map<NotificationCategory, number>();
    unreadList.forEach((n) => {
      const cat = getNotificationCategory(n.type);
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    });
    return counts;
  }, [unreadList]);

  const groupedByCategory = useMemo(() => {
    const groups = new Map<NotificationCategory, typeof statusFilteredList>();
    statusFilteredList.forEach((n) => {
      const cat = getNotificationCategory(n.type);
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(n);
    });
    return groups;
  }, [statusFilteredList]);

  const categoryOrder: NotificationCategory[] = [
    "TRANSFER",
    "JOB",
    "REMINDER",
    "LEAVE",
    "ANNOUNCEMENT",
    "ATTENDANCE",
    "OTHER",
  ];

  const toggleCategory = (category: NotificationCategory) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const hasAnyResults = groupedByCategory.size > 0;

  const handleMarkAsRead = async (notification: Notification) => {
    await updateStatus({
      id: notification.id,
      recipientSub: notification.recipientSub,
      notificationCreated: notification.notificationCreated,
      status: "READ",
    });
  };

  return (
    <AnimatePresence initial={false}>
      {openNotificationSidebar && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setOpenNotificationSidebar(false)}
            className={cn(
              sharedStyles.sidebarOverlay,
              openNotificationSidebar ? "block" : "hidden",
            )}
          />
          <motion.div
            key="notificationSidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
            className={cn(
              sharedStyles.sidebar,
              sharedStyles.sidebarNotification,
            )}
          >
            <div className="flex h-full min-h-0 flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200/80 px-4 py-4 dark:border-(--clr-borderDark)">
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                    Notifications
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Stay up to date with recent activity
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenNotificationSidebar(false)}
                  className="grid size-9 place-items-center rounded-full text-gray-500 transition-colors hover:cursor-pointer hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-100 dark:focus-visible:ring-offset-(--bg-primary_dark)"
                  aria-label="Close notifications"
                >
                  <X size={19} strokeWidth={2} />
                </button>
              </div>

              <div className="px-4 pt-3">
                <NotificationTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  counts={data?.counts}
                />
              </div>

              {/* Grouped list */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gray-50/70 px-3 pb-5 pt-1 custom-scrollbar dark:bg-black/10">
                {hasAnyResults ? (
                  categoryOrder.map((category) => {
                    const items = groupedByCategory.get(category);
                    if (!items || items.length === 0) return null;

                    return (
                      <NotificationCategoryGroup
                        key={category}
                        category={category}
                        notifications={items}
                        unreadCount={unreadCountByCategory.get(category) ?? 0}
                        isCollapsed={collapsedCategories.has(category)}
                        onToggle={toggleCategory}
                        userId={userId ?? ""}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    );
                  })
                ) : (
                  <div className="flex h-full min-h-48 flex-col items-center justify-center px-6 text-center">
                    <div className="mb-3 grid size-11 place-items-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">
                      <span className="text-lg">✓</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      You're all caught up
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      No {activeTab} notifications
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationSidebar;

// import useGlobalContext from "@/context/useGlobalContext";
// import { useGetAll } from "@/utils/api";
// import NotificationCard from "./NotificationCard";
// import type { NotificationResponse } from "@/schemas";
// import NotificationTabs, { type NotificationTab } from "./NotificationTabs";
// import NotificationCategoryFilter from "./NotificationCategoryFilter";
// import {
//   getNotificationCategory,
//   type NotificationCategory,
// } from "@/utils/notificationCategory";
// import { X } from "lucide-react";

// // $ Animation
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { sharedStyles } from "@/styles/shared";
// import { useMemo, useState } from "react";

// const NotificationSidebar = () => {
//   const { openNotificationSidebar, setOpenNotificationSidebar, userId } =
//     useGlobalContext();

//   const [activeTab, setActiveTab] = useState<NotificationTab>("unread");
//   const [activeCategory, setActiveCategory] = useState(
//     "all" as NotificationCategory | "all",
//   );

//   const { data } = useGetAll<NotificationResponse>({
//     queryKey: ["notifications", "user-notifications"],
//     resourcePath: "api/notifications",
//     params: {
//       id: userId,
//     },
//   });

//   const statusFilteredList = useMemo(
//     () => data?.notifications?.[activeTab] ?? [],
//     [data, activeTab],
//   );

//   // Categories are derived from the *status-filtered* list, so switching to
//   // "Read" won't show a category chip for something with zero read items.
//   const availableCategories = useMemo(() => {
//     const set = new Set<NotificationCategory>();
//     statusFilteredList.forEach((n) => set.add(getNotificationCategory(n.type)));
//     return Array.from(set);
//   }, [statusFilteredList]);

//   const visibleList = useMemo(() => {
//     if (activeCategory === "all") return statusFilteredList;
//     return statusFilteredList.filter(
//       (n) => getNotificationCategory(n.type) === activeCategory,
//     );
//   }, [statusFilteredList, activeCategory]);

//   // Reset category filter if it no longer applies after switching status tab
//   const handleTabChange = (tab: NotificationTab) => {
//     setActiveTab(tab);
//     setActiveCategory("all");
//   };

//   return (
//     <AnimatePresence initial={false}>
//       {openNotificationSidebar && (
//         <>
//           <motion.div
//             key="overlay"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             onClick={() => setOpenNotificationSidebar(false)}
//             className={cn(
//               sharedStyles.sidebarOverlay,
//               openNotificationSidebar ? "block" : "hidden",
//             )}
//           />
//           <motion.div
//             key="notificationSidebar"
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             transition={{ duration: 0.25, ease: "easeInOut" }}
//             className={cn(
//               sharedStyles.sidebar,
//               sharedStyles.sidebarNotification,
//             )}
//           >
//             <div className="flex flex-col gap-1 h-full md:px-1 md:py-2 p-2">
//               {/* Header */}
//               <div className="flex items-center justify-between px-2 pb-3">
//                 <h2 className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400">
//                   NOTIFICATIONS
//                 </h2>
//                 <button
//                   type="button"
//                   onClick={() => setOpenNotificationSidebar(false)}
//                   className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:cursor-pointer"
//                   aria-label="Close notifications"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//               <div>
//                 <NotificationTabs
//                   activeTab={activeTab}
//                   onTabChange={handleTabChange}
//                   counts={data?.counts}
//                 />
//               </div>
//               <div>
//                 <NotificationCategoryFilter
//                   activeCategory={activeCategory}
//                   onCategoryChange={setActiveCategory}
//                   availableCategories={availableCategories}
//                 />
//               </div>

//               {/* List */}
//               <div className="bg-gray-50 dark:bg-(--clr-bgItem) min-h-full overflow-y-scroll flex flex-col gap-2 no-scrollbar p-2 rounded-lg">
//                 {visibleList.length > 0 ? (
//                   visibleList.map((item) => (
//                     <NotificationCard
//                       key={item.id}
//                       row={item}
//                       userId={userId ?? ""}
//                     />
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-400 text-center py-6">
//                     No {activeTab} notifications
//                   </p>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// //   return (
// //     <AnimatePresence initial={false}>
// //       {openNotificationSidebar && (
// //         <>
// //           <motion.div
// //             key="overlay"
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             exit={{ opacity: 0 }}
// //             transition={{ duration: 0.2 }}
// //             onClick={() => setOpenNotificationSidebar(false)}
// //             className={cn(
// //               sharedStyles.sidebarOverlay,
// //               openNotificationSidebar ? "block" : "hidden",
// //             )}
// //           />
// //           <motion.div
// //             key="notificationSidebar"
// //             initial={{ x: "100%" }}
// //             animate={{ x: 0 }}
// //             exit={{ x: "100%" }}
// //             transition={{ duration: 0.25, ease: "easeInOut" }}
// //             className={cn(
// //               sharedStyles.sidebar,
// //               sharedStyles.sidebarNotification,
// //             )}
// //           >
// //             <div className="flex flex-col h-full lg:p-1 p-2">
// //               <div className="bg-gray-50 dark:bg-(--clr-bgItem) min-h-full overflow-y-scroll flex flex-col gap-2 no-scrollbar p-2 rounded-lg">
// //                 {Array.isArray(notifications) &&
// //                   notifications.map((item) => (
// //                     <NotificationCard
// //                       key={item.id}
// //                       row={item}
// //                       userId={userId ?? ""}
// //                     />
// //                   ))}
// //               </div>
// //             </div>
// //           </motion.div>
// //         </>
// //       )}
// //     </AnimatePresence>
// //   );
// // };

// export default NotificationSidebar;
