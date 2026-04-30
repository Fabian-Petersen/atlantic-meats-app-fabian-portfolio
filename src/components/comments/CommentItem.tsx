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
      className={`flex gap-2 ${isRight ? "justify-end items-center" : "justify-start items-center"}`}
    >
      <CommentAvatar comment_by={comment.comment_by} className="shrink-0" />
      <div
        className={`flex-col gap-2 ${isRight ? "bg-primary/30 dark:bg-primary/90" : "bg-gray-200"} rounded-md min-h-16 h-auto p-2`}
      >
        <div className="flex justify-between gap-4">
          <p className="text-xs text-gray-800 capitalize font-montserrat font-semibold">
            {comment.comment_by}
          </p>
          <p className="text-gray-500 text-[0.65rem] dark:text-(--clr-textLight)">
            {comment.createdAt}
          </p>
        </div>
        <p className="text-xs text-gray-800">{comment.comment}</p>
      </div>
    </div>
  );
};

export default CommentItem;
