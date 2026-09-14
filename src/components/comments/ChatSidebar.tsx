import useGlobalContext from "@/context/useGlobalContext";
import CommentForm from "./CommentForm";
import type { CommentAPIResponse } from "@/schemas";
import CommentItem from "./CommentItem";
import { useById } from "@/utils/api";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { useMatch } from "react-router-dom";
import { sidebarMotion } from "@/styles/motionStyles";
// import { PageLoadingSpinner } from "../features/PageLoadingSpinner";

// $ Animation
import { motion, AnimatePresence } from "framer-motion";

const ChatSidebar = () => {
  const { openChatSidebar, setOpenChatSidebar, selectedRowId } =
    useGlobalContext();

  // $ Disable the comments input when a job is completed
  const isCompleteJobPage = useMatch("/jobs/:id/complete") !== null;
  const isCompleteJobsPage = useMatch("/jobs/completed") !== null;
  const isDisabled = isCompleteJobPage || isCompleteJobsPage;

  const { data: comments, isError } = useById<CommentAPIResponse[]>({
    id: selectedRowId ?? "",
    queryKey: ["CommentsKey"],
    resourcePath: "api/comments",
  });

  if (isError) {
    <p>Error: Commments cannot be loaded</p>;
  }

  return (
    <AnimatePresence initial={false} mode="sync">
      {openChatSidebar && (
        <>
          <motion.div
            key="overlay"
            variants={sidebarMotion.overlay}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => setOpenChatSidebar(false)}
            className={sharedStyles.sidebarOverlay}
            aria-hidden="true"
          />
          <motion.aside
            key="chatSidebar"
            variants={sidebarMotion.panel}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(sharedStyles.sidebar, sharedStyles.sidebarChat)}
            role="dialog"
            aria-modal="true"
            aria-label="Comments"
          >
            <div className="flex h-full min-h-0 flex-col bg-gray-50/60 dark:bg-black/10">
              {selectedRowId && (
                <CommentForm
                  disabled={isDisabled}
                  selectedRowId={selectedRowId}
                  setOpenChatSidebar={setOpenChatSidebar}
                />
              )}
              <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-4 py-5 custom-scrollbar">
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatSidebar;
