import axios from "axios";
// $ Form
import { useForm, type Resolver } from "react-hook-form";

// $ API hooks
import { usePOST, type Resource } from "@/utils/api";

// $ Utils
import { assignToGroup } from "@/data/technicians";
import { useGetTechnicians } from "@/utils/getTechniciansList";

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
// import { PageLoadingSpinner } from "../features/PageLoadingSpinner";

const ApproveRequestForm = () => {
  const {
    setShowApproveRequestDialog,
    selectedRowId,
    setShowSuccess,
    showApproveRequestDialog,
    setSuccessConfig,
  } = useGlobalContext();

  const { data: technicians = [] } = useGetTechnicians();

  // $ Form Schema
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ApproveRequestFormValues>({
    defaultValues: {
      assign_to_group: "",
      targetDate: "",
      assign_to_sub: "",
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

  // if (isLoading) {
  //   return <PageLoadingSpinner />;
  // }

  // console.log("technicians:", technicians);
  const onSubmit = async (data: ApproveRequestFormValues) => {
    try {
      const selectedTechnician = technicians.find(
        (tech) => tech.sub === data.assign_to_sub,
      );

      const technicianName = selectedTechnician?.name ?? "";
      const payload: ApproveRequestPayload = {
        ...data,
        status: "Approved",
        selectedRowId: selectedRowId,
        assign_to_name: technicianName,
      };
      // $ Send payload to the backend
      await approveItem(payload);
      // console.log("payload:", payload);
      // console.log(approveItem);

      // $ Reset the form
      reset();

      // $ Close the modal
      setShowApproveRequestDialog(false);
      setSuccessConfig({
        title: "Success",
        message: "The Request was Successfully Approved!!!",
        resourcePath: "jobs-list-approved",
      });
      setShowSuccess(true);

      // toast.success("The item was sucessfully assigned");
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
      className="flex flex-col rounded-lg lg:w-full text-(--clr-textLight) dark:text-(--clr-textDark) dark:bg-(--bg-primary_dark) dark:border-gray-700/50"
    >
      <div className="grid gap-6 w-full py-4">
        <FormRowSelect
          register={register}
          name="assign_to_group"
          options={assignToGroup}
          placeholder="Select a Group"
          error={errors.assign_to_group}
          // placeholder="Select Group"
        />

        <FormRowSelect
          register={register}
          name="assign_to_sub"
          options={technicians ?? []}
          placeholder="Assign To"
          error={errors.assign_to_sub}
          // placeholder={"Assign to technician"}
        />
        <FormRowInput
          register={register}
          type="date"
          placeholder="Target Date"
          name="targetDate"
          error={errors.targetDate}
          className=""
        />
        <div className="flex justify-between w-full gap-2 mt-auto">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setShowApproveRequestDialog(false)}
            className="flex-1 py-2 text-xs font-medium rounded-lg border border-red-200 dark:border-red-500 text-red-600 dark:bg-red-300/20 dark:text-red-300 hover:bg-gray-50 dark:hover:bg-red/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 py-2 text-xs font-medium rounded-lg border border-primary bg-primary/20 dark:border-primary text-primary dark:bg-primary/20 dark:text-primary hover:bg-primary/50 dark:hover:bg-primary/5 transition-colors"
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

export default ApproveRequestForm;
