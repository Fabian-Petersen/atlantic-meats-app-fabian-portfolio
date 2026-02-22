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
    resourcePath: "comment",
    queryKey: ["CommentsKey"],
  });

  // $ Submit the data to the backend
  const onSubmit = async (data: CommentRequestFormValues) => {
    // console.log(data);
    try {
      const payload: CommentPayload = { ...data, request_id: selectedRowId };
      // console.log("payload:", payload);
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
      className="bg-gray-50 w-full p-2 rounded-md h-auto gap-4 flex-col flex"
    >
      <div className="flex gap-2 items-center justify-between w-full">
        <p className="text-gray-500 text-md">Add a comment</p>
        <button
          className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2 text-xl"
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
        className="min-h-0 h-10 border-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0 text-gray-500"
      />
      {errors.comment && (
        <p className="text-xs text-red-500">{errors.comment.message}</p>
      )}
      <div className="w-full flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="hover:cursor-pointer rounded-full bg-primary py-2 px-1 min-w-24 justify-center max-w-32 text-white flex gap-2 items-center"
        >
          <span className="text-xs">{isPending ? "Sending..." : "Send"}</span>
          <SendHorizonal size={12} />
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
