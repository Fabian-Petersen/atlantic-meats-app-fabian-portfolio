// $ This component notifies the user if there are new notifications pending.

import { LucideBell } from "lucide-react";
import Button from "@/components/features/Button";
import useGlobalContext from "@/context/useGlobalContext";
import { useGetAll } from "@/utils/api";
import type { Notification } from "@/schemas";

type Props = {
  className?: string;
};

const NotificationButton = ({ className }: Props) => {
  const { setOpenNotificationSidebar, setIsOpen, setOpenChatSidebar, userId } =
    useGlobalContext();

  const { data: notifications } = useGetAll<Notification[]>({
    queryKey: ["notifications", "user-notifications"],
    resourcePath: "api/notifications",
    params: {
      id: userId,
    },
  });

  // console.log("notifications:", notifications);

  const count =
    notifications?.filter((item) => item.status === "UNREAD").length ?? 0;

  return (
    <div className="p-2 flex items-center justify-center text-gray-900 hover:cursor-pointer relative">
      <Button
        type="button"
        onClick={() => {
          setIsOpen(false);
          setOpenChatSidebar(false);
          setOpenNotificationSidebar((prev) => !prev);
        }}
        className={`${className} hover:cursor-pointer rounded-full bg-white/30 p-1.5`}
      >
        <LucideBell size={18} />
      </Button>
      {count > 0 ? (
        <div className="absolute top-1 right-0 p-1.5 bg-red-500 text-white text-xs flex justify-center items-center rounded-full size-4">
          {count}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NotificationButton;
