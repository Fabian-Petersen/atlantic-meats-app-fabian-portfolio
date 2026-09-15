import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

import TextAreaInput from "../../../customComponents/TextAreaInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";
import FormHeading from "../../../customComponents/FormHeading";
import FormActionButtons from "@/components/features/FormActionButtons";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useGlobalContext from "@/context/useGlobalContext";
import {
  manualAssetVerificationSchema,
  type ManualAssetVerificationRequest,
  type VerifyAssetResponse,
} from "@/schemas/assetSchemas";
import { usePOST } from "@/utils/api";
import { location } from "@/data/assetSelectOptions";

const ManualVerificationDialog = () => {
  const navigate = useNavigate();
  const {
    selectedRowId,
    showManualVerificationDialog,
    setShowManualVerificationDialog,
  } = useGlobalContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualAssetVerificationRequest>({
    defaultValues: {
      id: selectedRowId ?? "",
      location: "",
      reason: "",
    },
    resolver: zodResolver(manualAssetVerificationSchema),
  });

  const { mutateAsync: verifyManually, isPending } = usePOST<
    ManualAssetVerificationRequest,
    VerifyAssetResponse
  >({
    resourcePath: `api/assets/${selectedRowId ?? ""}/verify-manual`,
    queryKey: ["assets"],
  });

  const closeDialog = () => {
    setShowManualVerificationDialog(false);
    reset();
    navigate("/assets/list");
  };

  const onSubmit = async (data: ManualAssetVerificationRequest) => {
    try {
      const response = await verifyManually({
        ...data,
        id: selectedRowId ?? data.id,
      });

      toast.success(response.message || "Asset manually verified", {
        duration: 1500,
      });
      closeDialog();
    } catch (error) {
      console.error("Manual asset verification failed", error);
      toast.error("Failed to verify asset manually", { duration: 1500 });
    }
  };

  if (!selectedRowId) return null;

  const sortedLocations = [...location].sort((a, b) => a.localeCompare(b));

  return (
    <Dialog
      open={showManualVerificationDialog}
      onOpenChange={(open) => {
        if (!open) closeDialog();
      }}
    >
      <DialogContent className="sm:max-w-[625px] bg-white z-3000 dark:bg-[#1d2739] border-none dark:text-gray-100 dark:border-gray-700/50">
        <div className="flex justify-center items-center">
          <div className="rounded-full bg-green-100 p-4 text-green-600 dark:bg-green-950/50 dark:text-green-400">
            <ShieldCheck className="size-12 md:size-16" aria-hidden="true" />
          </div>
        </div>
        <DialogTitle className="py-4">
          <FormHeading
            arial-label="manual asset verification modal"
            headingStyles="justify-center"
            className="font-normal"
            heading="Manual Verification"
          />
        </DialogTitle>
        <form
          id="manual-verification-form"
          className="flex flex-col rounded-lg w-full text-(--clr-font) dark:bg-[#1d2739]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid gap-5">
            <FormRowSelect
              name="location"
              label="Current Location"
              options={sortedLocations}
              register={register}
              error={errors.location}
              disabled={isPending}
              required
            />
            <TextAreaInput
              name="reason"
              label="Reason for manual verification"
              // placeholder="Enter reason for manual verification"
              register={register}
              error={errors.reason}
              disabled={isPending}
              required
            />
          </div>
          <FormActionButtons
            formId="manual-verification-form"
            cancelText="Cancel"
            submitText="Verify Asset"
            isPending={isPending}
            onCancel={closeDialog}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualVerificationDialog;
