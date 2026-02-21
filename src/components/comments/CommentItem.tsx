import type { CommentAPIResponse } from "@/schemas/commentSchemas";

type CommentItemProps = {
  comment: CommentAPIResponse;
  align: "left" | "right";
};

const CommentItem = ({ comment, align }: CommentItemProps) => {
  const isRight = align === "right";
  return (
    <div className={`flex ${isRight ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex flex-col gap-2 ${isRight ? "bg-primary/30" : "bg-gray-200"} rounded-md min-h-16 h-auto p-2`}
      >
        <div className="flex gap-2">
          <p className="text-xs text-gray-500 capitalize">
            {comment.comment_by}
          </p>
          <p className="text-gray-500 text-[0.65rem]">{comment.createdAt}</p>
        </div>
        <p className="text-xs text-gray-600">{comment.comment}</p>
      </div>
    </div>
  );
};

export default CommentItem;
