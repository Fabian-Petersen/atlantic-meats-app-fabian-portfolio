import { SendHorizonal } from "lucide-react";
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
  disabled?: boolean;
};

// $ Hooks and API Functions
import { usePOST } from "@/utils/api";
import { Spinner } from "../ui/spinner";
import clsx from "clsx";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

const CommentForm = ({
  selectedRowId,
  setOpenChatSidebar,
  disabled = false,
}: Props) => {
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
    resourcePath: "api/comments",
    queryKey: ["CommentsKey"],
  });

  // $ Submit the data to the backend
  const onSubmit = async (data: CommentRequestFormValues) => {
    try {
      const payload: CommentPayload = { ...data, request_id: selectedRowId };
      await mutateAsync(payload);
      reset();
    } catch (error) {
      console.log("comment-error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="relative z-10 flex h-auto w-full flex-col gap-4 border-b border-gray-200/80 bg-white px-3 py-2 shadow-sm md:gap-3 md:px-4 md:py-4 dark:border-(--clr-borderDark) dark:bg-(--bg-primary_dark)"
    >
      <div className="flex h-auto w-full items-center justify-between gap-2">
        <p className="text-sm font-semibold tracking-tight text-gray-900 md:text-base dark:text-gray-100">
          Add a comment
        </p>
        <button
          className="grid size-8 place-items-center rounded-full text-gray-500 transition-colors hover:cursor-pointer hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:size-9 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-100 dark:focus-visible:ring-offset-(--bg-primary_dark)"
          type="button"
          aria-label="close button"
          onClick={() => setOpenChatSidebar(false)}
        >
          <X size={19} strokeWidth={2} />
        </button>
      </div>
      <textarea
        rows={1}
        disabled={disabled}
        {...register("comment")}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "auto"; // reset
          el.style.height = `${el.scrollHeight}px`; // grow
        }}
        className={cn(
          sharedStyles.formInputDefault,
          sharedStyles.formTextArea,
          "max-h-32 min-h-9 rounded-xl bg-gray-50 px-3 py-2 leading-relaxed shadow-inner transition-[border-color,box-shadow] placeholder:text-gray-400 focus:bg-white focus:shadow-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 md:min-h-11 md:py-3 dark:bg-white/5 dark:focus:bg-white/8 dark:disabled:bg-white/5",
        )}
      />
      {errors.comment && (
        <p className={cn(sharedStyles.formError)}>{errors.comment.message}</p>
      )}
      <div className="flex w-full justify-end">
        <button
          type="submit"
          disabled={isPending}
          className={clsx(
            isPending ? "py-1" : "py-2",
            "flex min-w-24 max-w-32 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-white shadow-sm transition-[background-color,box-shadow,transform] hover:cursor-pointer hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-400",
          )}
        >
          <span className="text-xs">
            {isPending ? (
              <Spinner className="size-6" />
            ) : (
              <div className="flex w-full items-center justify-center gap-2">
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
