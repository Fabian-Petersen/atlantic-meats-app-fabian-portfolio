import useGlobalContext from "@/context/useGlobalContext";
import { useGetAll } from "@/utils/api";
import { Spinner } from "../ui/spinner";
import NotificationCard from "./NotificationCard";
import type { JobAPIResponse } from "@/schemas";

// import { ErrorPage } from "../features/Error";

const NotificationSidebar = () => {
  const { openNotificationSidebar } = useGlobalContext();

  const { data: pendingJobs, isPending } = useGetAll<JobAPIResponse[]>({
    queryKey: ["jobs", "pending-jobs"],
    resourcePath: "jobs/requests",
    params: {
      status: "Pending",
    },
  });

  // [INFO] Change to something nice
  if (isPending) {
    <Spinner />;
  }

  return (
    <div
      className={`overflow-y-scroll right-0 z-1000 w-80 lg:w-96 fixed top-(--sm-navbarHeight) md:top-(--lg-navbarHeight) h-(--sm-sidebarHeight) md:h-(--lg-sidebarHeight) border-l border-l-gray-200 dark:border-l-[rgba(55,65,81,0.5)]
      bg-white dark:bg-(--bg-primary_dark) transform transition-transform duration-200 ease-in translate-x-0
    ${openNotificationSidebar ? "translate-x-0" : "translate-x-full ease-out"}`}
    >
      <div className="flex flex-col h-full gap-4 lg:p-1 p-2">
        <div className="bg-gray-50 dark:bg-(--clr-bgItem) min-h-full overflow-y-scroll flex flex-col gap-4 no-scrollbar p-2 rounded-lg">
          {Array.isArray(pendingJobs) &&
            pendingJobs.map((job) => (
              <NotificationCard key={job.id} row={job} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSidebar;
