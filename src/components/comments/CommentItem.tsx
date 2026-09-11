import type { CommentAPIResponse } from "@/schemas/commentSchemas";
import CommentAvatar from "./CommentAvatar";

type CommentItemProps = {
  comment: CommentAPIResponse;
  align: "left" | "right";
};

const CommentItem = ({ comment, align }: CommentItemProps) => {
  const isRight = align === "right";
  return (
    <div
      className={`flex items-end gap-2.5 ${isRight ? "justify-end" : "justify-start"}`}
    >
      <CommentAvatar comment_by={comment.comment_by} className="shrink-0" />
      <div
        className={`flex h-auto min-h-16 max-w-[78%] flex-col gap-2 rounded-2xl border px-3.5 py-3 shadow-xs ${
          isRight
            ? "rounded-br-sm border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/15"
            : "rounded-bl-sm border-gray-200 bg-white dark:border-(--clr-borderDark) dark:bg-(--bg-primary_dark)"
        }`}
      >
        <div className="flex items-baseline justify-between gap-4">
          <p className="truncate font-montserrat text-xs font-semibold capitalize text-gray-800 dark:text-gray-100">
            {comment.comment_by}
          </p>
          <p className="shrink-0 text-[0.625rem] text-gray-400 dark:text-gray-500">
            {comment.createdAt}
          </p>
        </div>
        <p className="wrap-break-word whitespace-pre-wrap text-xs leading-relaxed text-gray-700 dark:text-gray-300">
          {comment.comment}
        </p>
      </div>
    </div>
  );
};

export default CommentItem;
