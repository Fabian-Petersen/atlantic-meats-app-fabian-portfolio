import axios from "axios";
// $ Form
import { useForm, type Resolver } from "react-hook-form";

// $ API hooks
import { usePOST, type Resource } from "@/utils/api";

// $ Utils
import { technicians, assignToGroup } from "@/data/technicians";

// $ Schema & types
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ApproveRequestFormValues,
  type ApproveRequestPayload,
  approveRequestSchema,
} from "@/schemas/approveRejectSchemas";

// $ Components
import FormRowInput from "@/../customComponents/FormRowInput";
import FormRowSelect from "@/../customComponents/FormRowSelect";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

// $ Context
import useGlobalContext from "@/context/useGlobalContext";
import { useNavigate } from "react-router-dom";

const RequestRejectedForm = () => {
  const {
    setShowApproveRequestDialog,
    selectedRowId,
    showApproveRequestDialog,
  } = useGlobalContext();
  const navigate = useNavigate();

  // $ Form Schema
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ApproveRequestFormValues>({
    defaultValues: {
      assignToGroup: "",
      targetDate: "",
      assign_to_name: "",
    },

    resolver: zodResolver(
      approveRequestSchema,
    ) as unknown as Resolver<ApproveRequestFormValues>,
  });

  const { mutateAsync: approveItem, isPending } = usePOST({
    resourcePath: `job-request-approved` as Resource,
    queryKey: ["maintenanceRequests"] as const,
  });

  if (!showApproveRequestDialog || !selectedRowId) return null;

  const assign_to_sub = ""; //This must be collected from the list of technicians returned from the database

  const onSubmit = async (data: ApproveRequestFormValues) => {
    try {
      const payload: ApproveRequestPayload = {
        ...data,
        status: "In Progress",
        selectedRowId: selectedRowId,
        assign_to_sub: assign_to_sub,
      };
      // $ Send payload to the backend
      await approveItem(payload);

      // $ Reset the form
      reset();

      // $ Close the modal
      setShowApproveRequestDialog(false);

      // $ Inform the user of successful submission
      toast.success("The item was sucessfully assigned");

      // $ Navigate back to the requests list page after successfull submit
      setTimeout(() => {
        navigate("/maintenance-requests-list");
      }, 1500);
    } catch (error) {
      console.log(error);
      console.error("Approve Request failed:", error);

      if (axios.isAxiosError<{ message: string }>(error)) {
        // The error returned is AxiosError hence to access response the type must be handled as such
        toast.error(error?.response?.data?.message); // Pass the message from the backend to the user to inform user what must be done
      } else toast.error("Failed to assign item");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-lg lg:w-full text-(--clr-font) dark:bg-[#1d2739]"
    >
      <div className="grid gap-6 w-full py-4">
        <FormRowSelect
          register={register}
          name="assignToGroup"
          options={assignToGroup}
          label="Select a Group"
          error={errors.assignToGroup}
          // placeholder="Select Group"
        />
        <FormRowSelect
          register={register}
          name="assign_to_name"
          options={technicians}
          label="Assign To"
          error={errors.assign_to_name}
          // placeholder={"Assign to technician"}
        />

        <FormRowInput
          register={register}
          type="date"
          label="Target Date"
          // placeholder="Select a Target Date"
          name="targetDate"
          error={errors.targetDate}
          className=""
        />
        <div className="flex lg:w-1/2 ml-auto gap-2 max-w-72 bg-white mt-auto">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setShowApproveRequestDialog(false)}
            className="w-full rounded-full bg-red-500 px-6 py-2 transition hover:bg-red-500/90 hover:cursor-pointer text-white disabled:opacity-50 dark:text-gray-200 lg:w-32"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-primary/90 px-6 py-2 text-white transition hover:bg-primary hover:cursor-pointer disabled:opacity-50 lg:w-32"
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
