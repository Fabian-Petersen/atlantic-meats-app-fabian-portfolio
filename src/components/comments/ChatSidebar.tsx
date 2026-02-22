import useGlobalContext from "@/context/useGlobalContext";
// import { X } from "lucide-react";
import CommentForm from "./CommentForm";
import type { CommentAPIResponse } from "@/schemas";
import CommentItem from "./CommentItem";
import { useById } from "@/utils/api";

// import { ErrorPage } from "../features/Error";

const ChatSidebar = () => {
  const { openChatSidebar, setOpenChatSidebar, selectedRowId } =
    useGlobalContext();

  const { data: comments = [] } = useById<CommentAPIResponse[]>({
    id: selectedRowId ?? "",
    queryKey: ["CommentsKey"],
    resourcePath: "comment",
  });

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

  return (
    <div
      className={`overflow-y-scroll right-0 z-1000 w-96 fixed top-16 lg:top-(--lg-navbarHeight) h-(--sm-sidebarHeight) lg:h-(--lg-sidebarHeight) border-l border-l-gray-200 dark:border-r-[rgba(55,65,81,0.5)]
      bg-white dark:bg-bgdark transform transition-transform duration-200 ease-in translate-x-0
    ${openChatSidebar ? "translate-x-0" : "translate-x-full ease-out"}`}
    >
      <div className="flex flex-col h-full gap-4 p-1">
        {/* <button
          className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2 absolute text-xl top-5 right-5 z-2000"
          type="button"
          aria-label="close button"
          onClick={() => setOpenChatSidebar(false)}
        >
          <X />
        </button> */}
        {selectedRowId && (
          <CommentForm
            selectedRowId={selectedRowId}
            setOpenChatSidebar={setOpenChatSidebar}
          />
        )}
        <div className="bg-gray-50 min-h-full overflow-y-scroll flex flex-col gap-2 no-scrollbar p-2 rounded-lg">
          {comments.map((comment, index) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              align={index % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
