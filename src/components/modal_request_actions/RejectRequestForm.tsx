import axios from "axios";
// $ Form
import { useForm, type Resolver } from "react-hook-form";

// $ API hooks
import { usePOST, type Resource } from "@/utils/api";

// $ Schema & types
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type JobRejectRequestFormValues,
  type JobRejectRequestPayload,
  jobRejectRequestSchema,
} from "@/schemas/approveRejectSchemas";

// $ Components
import TextAreaInput from "@/../customComponents/TextAreaInput";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { MessageSquareWarning, X } from "lucide-react";

// $ Context
import useGlobalContext from "@/context/useGlobalContext";
import { useNavigate } from "react-router-dom";
// import { OctagonX } from "lucide-react";
// import FormHeading from "../../../customComponents/FormHeading";

const RequestRejectedForm = () => {
  const {
    setShowRejectRequestDialog,
    selectedRowId,
    showRejectRequestDialog,
    setShowSuccess,
    setSuccessConfig,
  } = useGlobalContext();
  const navigate = useNavigate();

  // $ Form Schema
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<JobRejectRequestFormValues>({
    defaultValues: {
      reject_message: "",
    },

    resolver: zodResolver(
      jobRejectRequestSchema,
    ) as unknown as Resolver<JobRejectRequestFormValues>,
  });

  const { mutateAsync: rejectItem, isPending } = usePOST({
    id: selectedRowId ?? "",
    resourcePath: `jobs` as Resource,
    queryKey: ["maintenanceRequests"] as const,
    action: "reject",
  });

  if (!showRejectRequestDialog || !selectedRowId) return null;

  const onSubmit = async (data: JobRejectRequestFormValues) => {
    try {
      const payload: JobRejectRequestPayload = {
        ...data,
        status: "rejected",
        selectedRowId: selectedRowId,
      };
      // $ Send payload to the backend
      await rejectItem(payload);

      // $ Reset the form
      reset();

      // $ Close the modal
      setShowRejectRequestDialog(false);
      setSuccessConfig({
        title: "Success",
        message: "The Request was Rejected!!!",
        redirectPath: "jobs/pending-approval",
      });
      setShowSuccess(true);

      // $ Navigate back to the requests list page after successfull submit
      setTimeout(() => {
        navigate("/jobs/pending-approval");
      }, 1500);
    } catch (error) {
      console.log(error);
      // console.error("Reject Request failed:", error);

      if (axios.isAxiosError<{ message: string }>(error)) {
        // The error returned is AxiosError hence to access response the type must be handled as such
        toast.error(error?.response?.data?.message); // Pass the message from the backend to the user to inform user what must be done
      } else toast.error("Failed to reject item");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-5 text-(--clr-textLight) dark:text-(--clr-textDark)"
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700/70 dark:bg-slate-800/30">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
            <MessageSquareWarning className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Reason
            </h3>
            <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Be specific and include any changes required before resubmission.
            </p>
          </div>
        </div>

        <TextAreaInput
          register={register}
          label="Reason for rejection"
          placeholder="Explain why this job request cannot be approved"
          rows={4}
          name="reject_message"
          required={true}
          error={errors.reject_message}
          className="mb-0"
          textAreaStyles="min-h-28 resize-none bg-white text-sm placeholder:text-xs placeholder:text-slate-400 dark:bg-slate-900/40 dark:placeholder:text-slate-500"
        />
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isPending}
          onClick={() => setShowRejectRequestDialog(false)}
          className="min-h-10 rounded-lg border border-slate-300 bg-white px-5 py-2 text-xs font-medium text-slate-700 transition-colors hover:cursor-pointer hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-28 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-600 bg-red-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:cursor-pointer hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-36 dark:border-red-600 dark:bg-red-700 dark:hover:bg-red-600"
        >
          {isPending ? (
            <>
              <Spinner data-icon="inline-start" className="size-4" />
              <span>Rejecting...</span>
            </>
          ) : (
            <>
              <X className="size-4 capitalize" aria-hidden="true" />
              <span>Reject Job</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default RequestRejectedForm;
