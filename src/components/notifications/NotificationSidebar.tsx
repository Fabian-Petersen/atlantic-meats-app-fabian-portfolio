import useGlobalContext from "@/context/useGlobalContext";
import { useGetAll } from "@/utils/api";
import NotificationCard from "./NotificationCard";
import type { Notification } from "@/schemas";

// $ Animation
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

const NotificationSidebar = () => {
  const { openNotificationSidebar, setOpenNotificationSidebar, userId } =
    useGlobalContext();

  const { data: notifications } = useGetAll<Notification[]>({
    queryKey: ["notifications", "user-notifications"],
    resourcePath: "api/notifications",
    params: {
      id: userId,
    },
  });

  return (
    <AnimatePresence initial={false}>
      {openNotificationSidebar && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={cn(
              sharedStyles.sidebar,
              sharedStyles.sidebarNotification,
            )}
          >
            <div className="flex flex-col h-full lg:p-1 p-2">
              <div className="bg-gray-50 dark:bg-(--clr-bgItem) min-h-full overflow-y-scroll flex flex-col gap-2 no-scrollbar p-2 rounded-lg">
                {Array.isArray(notifications) &&
                  notifications.map((item) => (
                    <NotificationCard
                      key={item.id}
                      row={item}
                      userId={userId ?? ""}
                    />
                  ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationSidebar;
