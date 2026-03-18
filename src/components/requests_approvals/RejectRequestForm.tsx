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
      className="flex flex-col rounded-lg lg:w-full text-(--clr-font) dark:bg-[#1d2739]"
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
          className="placeholder-black resize-none overflow-hidden no-scrollbar placeholder:text-xs"
        />
        <div className="flex lg:w-1/2 ml-auto gap-2 max-w-72 bg-white mt-auto">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setShowRejectRequestDialog(false)}
            className="text-sm w-full rounded-full bg-red-500 px-6 py-2 transition hover:bg-red-500/90 hover:cursor-pointer text-white disabled:opacity-50 dark:text-gray-200 lg:w-32"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="text-sm w-full rounded-full bg-primary/90 px-6 py-2 text-white transition hover:bg-primary hover:cursor-pointer disabled:opacity-50 lg:w-32"
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
