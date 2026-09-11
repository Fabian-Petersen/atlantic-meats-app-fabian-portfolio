import { cn } from "@/lib/utils";
import { getInitialsElement } from "@/utils/getInitials";

type Props = {
  imageUrl?: string;
  comment_by: string;
  className?: string;
};

const CommentAvatar = ({
  className = "",
  comment_by,
  imageUrl = "",
}: Props) => {
  const full = comment_by.trim();
  const [name, surname] = full.split(" ");
  return (
    <div
      className={cn(
        className,
        "flex size-9 items-center justify-center rounded-full border-2 border-white bg-gray-200 p-1 text-xs font-semibold tracking-wider text-gray-600 shadow-sm dark:border-(--bg-primary_dark) dark:bg-gray-700 dark:text-gray-200",
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="User avatar"
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        getInitialsElement({
          name: name ?? "",
          surname: surname ?? "",
          className: "",
        })
      )}
    </div>
  );
};

export default CommentAvatar;
