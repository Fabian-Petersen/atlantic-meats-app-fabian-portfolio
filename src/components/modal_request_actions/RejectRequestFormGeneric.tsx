import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// $ Schema & types
import {
  transferRejectedRequestSchema,
  type RejectRequestFormValues,
} from "@/schemas/transfersSchemas";

// $ Hooks
import { useRejectRequest } from "@/hooks/useRejectRequest";

// $ Components
import TextAreaInput from "@/../customComponents/TextAreaInput";
import { Spinner } from "../ui/spinner";

// $ Context
import useGlobalContext from "@/context/useGlobalContext";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

const RejectRequestFormGeneric = () => {
  const {
    setShowRejectRequestDialogGeneric,
    selectedRowId,
    showRejectRequestDialogGeneric,
    rejectConfig,
  } = useGlobalContext();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reason: "",
    },
    resolver: zodResolver(
      transferRejectedRequestSchema,
    ) as unknown as Resolver<RejectRequestFormValues>,
  });

  const { resourcePath, queryKey, successMessage, errorMessage, redirectPath } =
    rejectConfig;

  const { submit: rejectRequest, isPending } = useRejectRequest({
    id: selectedRowId ?? "",
    resourcePath: resourcePath,
    queryKey: queryKey,
    successMessage: successMessage,
    errorMessage: errorMessage,
    redirectPath: redirectPath,
    onSettled: () => setShowRejectRequestDialogGeneric(false),
  });

  if (!showRejectRequestDialogGeneric || !selectedRowId) return null;

  const onSubmit = async (data: RejectRequestFormValues) => {
    await rejectRequest(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(sharedStyles.modalForm)}
    >
      <TextAreaInput
        register={register}
        placeholder="Enter reason for rejecting request"
        rows={1}
        name="reason"
        error={errors.reason}
        className="placeholder-black resize-none overflow-hidden no-scrollbar placeholder:text-lg"
      />
      {/* Actions */}
      <div className={cn(sharedStyles.btnParent, sharedStyles.modalBtnParent)}>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setShowRejectRequestDialogGeneric(false)}
          className={cn(sharedStyles.btnCancel, sharedStyles.btn)}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className={cn(sharedStyles.btnSubmit, sharedStyles.btn)}
        >
          {isPending ? (
            <Spinner
              data-icon="inline-start"
              className="flex items-center justify-center size-6 w-full"
            />
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
};

export default RejectRequestFormGeneric;
