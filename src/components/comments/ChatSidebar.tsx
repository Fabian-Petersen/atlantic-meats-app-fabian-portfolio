import useGlobalContext from "@/context/useGlobalContext";
import CommentForm from "./CommentForm";
import type { CommentAPIResponse } from "@/schemas";
import CommentItem from "./CommentItem";
import { useById } from "@/utils/api";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

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
      className={cn(
        sharedStyles.sidebar,
        openChatSidebar ? "translate-x-0" : "translate-x-full ease-out",
      )}
    >
      <div className="flex flex-col h-full gap-4 lg:p-1 p-2">
        {selectedRowId && (
          <CommentForm
            selectedRowId={selectedRowId}
            setOpenChatSidebar={setOpenChatSidebar}
          />
        )}
        <div className="overflow-y-scroll flex flex-col gap-4 custom-scrollbar p-2 rounded-lg h-auto">
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
