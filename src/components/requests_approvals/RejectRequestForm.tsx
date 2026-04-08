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

// $ Context
import useGlobalContext from "@/context/useGlobalContext";
import { useNavigate } from "react-router-dom";

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
    resourcePath: `job-request-rejected` as Resource,
    queryKey: ["maintenanceRequests"] as const,
  });

  if (!showRejectRequestDialog || !selectedRowId) return null;

  const onSubmit = async (data: JobRejectRequestFormValues) => {
    try {
      const payload: JobRejectRequestPayload = {
        ...data,
        status: "Rejected",
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
        resourcePath: "jobs-list-pending",
      });
      setShowSuccess(true);

      // $ Navigate back to the requests list page after successfull submit
      setTimeout(() => {
        navigate("/jobs-list-pending");
      }, 1500);
    } catch (error) {
      console.log(error);
      console.error("Reject Request failed:", error);

      if (axios.isAxiosError<{ message: string }>(error)) {
        // The error returned is AxiosError hence to access response the type must be handled as such
        toast.error(error?.response?.data?.message); // Pass the message from the backend to the user to inform user what must be done
      } else toast.error("Failed to reject item");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col rounded-lg lg:w-full dark:bg-(--bg-primary_dark) dark:text-gray-100 dark:border-gray-700/50"
    >
      <div className="grid gap-4 w-full lg:py-2">
        <p className="text-xs md:text-md text-gray-600 dark:text-gray-300">
          Are you sure you want to reject this item? <br />
          This action cannot be undone.
        </p>
        <TextAreaInput
          register={register}
          placeholder="Enter reason for rejecting request"
          rows={1}
          name="reject_message"
          error={errors.reject_message}
          className="placeholder-black resize-none overflow-hidden no-scrollbar placeholder:text-lg"
        />
        <div className="flex w-full lg:w-1/2 ml-auto gap-2 max-w-72 mt-auto">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setShowRejectRequestDialog(false)}
            className="flex-1 py-2 text-xs font-medium rounded-lg border border-red-200 dark:border-red-500 text-red-600 dark:bg-red-300/20 dark:text-red-300 hover:bg-gray-50 dark:hover:bg-red/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 py-2 text-xs font-medium rounded-lg border border-primary dark:border-primary text-primary dark:bg-primary/20 dark:text-primary-300 hover:bg-gray-50 dark:hover:bg-red/5 transition-colors"
          >
            {isPending ? (
              <div className="flex gap-4 items-center justify-center">
                <Spinner data-icon="inline-start" className="size-6" />
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RequestRejectedForm;
