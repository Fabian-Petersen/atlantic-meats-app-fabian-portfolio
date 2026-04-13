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

  const { data: comments, isPending } = useById<CommentAPIResponse[]>({
    id: selectedRowId ?? "",
    queryKey: ["CommentsKey"],
    resourcePath: "comments",
  });

  // [INFO] Change to something nice
  if (isPending) {
    // return <p>Loading...</p>;
  }

  return (
    <div
      className={`overflow-y-scroll right-0 z-1000 w-80 lg:w-96 fixed top-16 lg:top-(--lg-navbarHeight) h-(--sm-sidebarHeight) lg:h-(--lg-sidebarHeight) border-l border-l-gray-200 dark:border-l-[rgba(55,65,81,0.5)]
      bg-white dark:bg-bgdark transform transition-transform duration-200 ease-in translate-x-0
    ${openChatSidebar ? "translate-x-0" : "translate-x-full ease-out"}`}
    >
      <div className="flex flex-col h-full gap-4 lg:p-1 p-2">
        {selectedRowId && (
          <CommentForm
            selectedRowId={selectedRowId}
            setOpenChatSidebar={setOpenChatSidebar}
          />
        )}
        <div className="bg-gray-50 dark:bg-(--clr-bgItem) min-h-full overflow-y-scroll flex flex-col gap-4 no-scrollbar p-2 rounded-lg">
          {Array.isArray(comments) &&
            comments.map((comment, index) => (
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
