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
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
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
    resourcePath: `jobs/requests/rejected` as Resource,
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
        resourcePath: "jobs/pending",
      });
      setShowSuccess(true);

      // $ Navigate back to the requests list page after successfull submit
      setTimeout(() => {
        navigate("/jobs/pending");
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
      className={cn(sharedStyles.modalForm)}
    >
      {/* <div className={cn(sharedStyles.modalParent)}> */}
      {/* Header */}
      {/* <div className="flex flex-col items-center md:gap-3 justify-center w-full">
          <div className="rounded-full p-4 text-red-500 bg-red-500/20">
            <OctagonX className="size-12 md:size-16" />
          </div>
          <FormHeading
            heading="Reject Request"
            className={cn(sharedStyles.headingForm, "md:text-center")}
          />
        </div> */}
      {/* Body */}
      {/* <p className="text-cxs md:text-xs text-gray-600 dark:text-gray-300 text-center w-3/4 mx-auto">
          Are you sure you want to reject this item? This action cannot be
          undone.
        </p> */}
      {/* Form Input */}
      <TextAreaInput
        register={register}
        placeholder="Enter reason for rejecting request"
        rows={1}
        name="reject_message"
        error={errors.reject_message}
        className="placeholder-black resize-none overflow-hidden no-scrollbar placeholder:text-lg"
      />
      {/* Actions */}
      <div className={cn(sharedStyles.btnParent, sharedStyles.modalBtnParent)}>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setShowRejectRequestDialog(false)}
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
            <div className="flex gap-4 items-center justify-center">
              <Spinner data-icon="inline-start" className="size-6" />
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </div>
      {/* </div> */}
    </form>
  );
};

export default RequestRejectedForm;
