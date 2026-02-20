import useGlobalContext from "@/context/useGlobalContext";
import { X } from "lucide-react";
import { Textarea } from "../ui/textarea";
// import { useById } from "@/utils/api";
// import { PageLoadingSpinner } from "../features/PageLoadingSpinner";
// import type { JobAPIResponse } from "@/schemas";
// import { ErrorPage } from "../features/Error";
import { SendHorizonal } from "lucide-react";

const ChatSidebar = () => {
  const { openChatSidebar, setOpenChatSidebar } = useGlobalContext();

  // console.log(selectedRowId);
  // const { data: item } = useById<JobAPIResponse>({
  //   id: selectedRowId ?? "",
  //   queryKey: ["MAINTENANCE-REQUEST-ITEM"],
  //   resourcePath: "maintenance-request",
  // });

  // console.log(item);

  // if (isPending) {
  //   return <PageLoadingSpinner />;
  // }

  // // fallback UI if timeout reached
  // if (!item) {
  //   return <ErrorPage title="Error loading comments!!" message="" />;
  // }

  const handleSubmit = () => {};

  return (
    <div
      className={`right-0 z-1000 w-96 fixed top-16 lg:top-(--lg-navbarHeight) h-(--sm-sidebarHeight) lg:h-(--lg-sidebarHeight) border-l border-l-gray-200 dark:border-r-[rgba(55,65,81,0.5)]
      bg-white dark:bg-bgdark transform transition-transform duration-200 ease-in translate-x-0
    ${openChatSidebar ? "translate-x-0" : "translate-x-full ease-out"}`}
    >
      <div className="flex flex-col h-full gap-4 mt-6 p-1">
        <button
          className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2 absolute text-xl top-5 right-5 z-2000"
          type="button"
          aria-label="close button"
          onClick={() => setOpenChatSidebar(false)}
        >
          <X />
        </button>
        {/* Add a comment section */}
        <div className="bg-white w-full p-2 mt-10 rounded-md h-auto gap-4 flex-col flex">
          <p className="text-gray-500 text-md">Add a comment</p>
          <Textarea
            rows={1}
            className="border-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0 text-gray-500"
          />
          <div className="w-full flex justify-end">
            <button
              type="submit"
              onClick={handleSubmit}
              className="hover:cursor-pointer rounded-full bg-primary py-2 px-1 min-w-24 justify-center max-w-32 text-white flex gap-2 items-center"
            >
              <span className="text-md">Send</span>
              <SendHorizonal size={16} />
            </button>
          </div>
        </div>
        {/* Comments */}
        <div className="flex flex-col gap-4 p-2">
          <div className="flex flex-col gap-2 bg-gray-100 rounded-md min-h-16 h-auto p-2">
            <div className="flex gap-2">
              <p className="text-xs text-gray-500">Fabian Petersen</p>
              <p className="text-gray-500 text-[0.65rem]">2026-02-19 15:00</p>
            </div>
            <p className="text-xs text-gray-600">
              Can you please let me know if the contractor is on site already?
            </p>
          </div>
          <div className="flex flex-col gap-2 bg-gray-100 rounded-md min-h-16 h-auto p-2">
            <div className="flex gap-2">
              <p className="text-xs text-gray-500">Fabian Petersen</p>
              <p className="text-gray-400 text-[0.65rem]">2026-02-19 15:00</p>
            </div>
            <p className="text-xs text-gray-600">
              Can you please let me know if the contractor is on site already?
            </p>
          </div>
        </div>
        {/* Content */}
      </div>
    </div>
  );
};

export default ChatSidebar;
