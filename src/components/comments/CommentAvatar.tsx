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
        "rounded-full size-10 tracking-wider bg-gray-200 p-1 flex items-center justify-center text-sm",
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="User avatar"
          className="rounded-full w-full h-full object-cover"
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
