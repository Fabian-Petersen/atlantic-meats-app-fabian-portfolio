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
import { CalendarClock, Check, UserRoundCheck } from "lucide-react";

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
    control,
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
    id: selectedRowId ?? "",
    resourcePath: "api/jobs" as Resource,
    queryKey: ["jobs", "action: approve-request", selectedRowId] as const,
    action: "approve",
  });

  if (!showApproveRequestDialog || !selectedRowId) return null;

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
        redirectPath: "jobs/in-progress",
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
      className="flex w-full flex-col gap-4 text-(--clr-textLight) md:gap-5 dark:text-(--clr-textDark)"
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 md:p-4 dark:border-slate-700/70 dark:bg-slate-800/30">
        <div className="mb-4 flex items-start gap-3 md:mb-5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
            <UserRoundCheck className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Assignment details
            </h3>
            <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
              All fields are required before the job can be approved.
            </p>
          </div>
        </div>

        <div className="grid w-full gap-x-4 gap-y-5 sm:grid-cols-2">
          <FormRowSelect
            register={register}
            name="assign_to_group"
            options={assignToGroup}
            placeholder="Select a Group"
            label="Assign to group"
            required={true}
            error={errors.assign_to_group}
            className="mb-0"
          />

          <FormRowSelect
            register={register}
            name="assign_to_sub"
            label="Assign to technician"
            required={true}
            options={technicians ?? []}
            placeholder="Assign To"
            error={errors.assign_to_sub}
            className="mb-0"
          />

          <FormRowInput
            register={register}
            label="Target date"
            type="date"
            required={true}
            name="targetDate"
            error={errors.targetDate}
            control={control}
            Icon={CalendarClock}
            className="mb-0 sm:col-span-2"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isPending}
          onClick={() => setShowApproveRequestDialog(false)}
          className="min-h-10 rounded-lg border border-slate-300 bg-white px-5 py-2 text-xs font-medium text-slate-700 transition-colors hover:cursor-pointer hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-28 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-emerald-600 bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:cursor-pointer hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-36 dark:border-emerald-600 dark:bg-emerald-700 dark:hover:bg-emerald-600"
        >
          {isPending ? (
            <>
              <Spinner data-icon="inline-start" className="size-4" />
              <span>Approving...</span>
            </>
          ) : (
            <>
              <Check className="size-4 capitalize" aria-hidden="true" />
              <span>Approve Job</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ApproveRequestForm;
