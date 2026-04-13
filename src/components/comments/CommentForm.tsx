import { SendHorizonal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { X } from "lucide-react";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

// $ Import Types
import {
  type CommentPayload,
  type CommentRequestFormValues,
  commentRequestSchema,
} from "@/schemas/commentSchemas";

type Props = {
  selectedRowId: string;
  setOpenChatSidebar: (v: boolean) => void;
};

// $ Hooks and API Functions
import { usePOST } from "@/utils/api";
import { Spinner } from "../ui/spinner";
import clsx from "clsx";

const CommentForm = ({ selectedRowId, setOpenChatSidebar }: Props) => {
  //   console.log(selectedRowId);
  // $ Form Schema
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CommentRequestFormValues>({
    resolver: zodResolver(
      commentRequestSchema,
    ) as unknown as Resolver<CommentRequestFormValues>,
  });

  const onInvalid = (errs: typeof errors) => {
    console.log("validation errors:", errs);
  };

  const { mutateAsync, isPending } = usePOST({
    resourcePath: "comments",
    queryKey: ["CommentsKey"],
  });

  // $ Submit the data to the backend
  const onSubmit = async (data: CommentRequestFormValues) => {
    console.log("comment-message", data);
    try {
      const payload: CommentPayload = { ...data, request_id: selectedRowId };
      console.log("comment-payload:", payload);
      const response = await mutateAsync(payload);
      reset();

      console.log("comment-response:", response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="bg-gray-50 dark:bg-(--clr-bgItem) w-full p-2 rounded-md h-auto gap-4 flex-col flex"
    >
      <div className="flex gap-2 items-center justify-between w-full">
        <p className="text-gray-500 dark:text-(--clr-textDark) text-sm text-md">
          Add a comment
        </p>
        <button
          className="hover:cursor-pointer hover:bg-red-100 rounded-full dark:hover:bg-gray-300 d-full p-2 text-xl text-red-500"
          type="button"
          aria-label="close button"
          onClick={() => setOpenChatSidebar(false)}
        >
          <X />
        </button>
      </div>
      <Textarea
        rows={3}
        {...register("comment")}
        className="min-h-0 h-10 border-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-400 focus-visible:ring-offset-0 text-(--clr-textLight) dark:text-(--clr-textDark) text-[0.5rem]"
      />
      {errors.comment && (
        <p className="text-xs text-red-500">{errors.comment.message}</p>
      )}
      <div className="w-full flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className={clsx(
            isPending ? "py-1" : "py-2",
            "hover:cursor-pointer rounded-full bg-primary px-1 min-w-24 justify-center max-w-32 text-white flex gap-2 items-center",
          )}
        >
          <span className="text-xs">
            {isPending ? (
              <Spinner className="size-6" />
            ) : (
              <div className="flex gap-2 items-center w-full">
                <span>Send</span>
                <SendHorizonal size={12} />
              </div>
            )}
          </span>
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
