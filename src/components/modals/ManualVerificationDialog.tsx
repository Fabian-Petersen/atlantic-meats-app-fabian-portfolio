import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type FieldError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import FormInfo from "@/components/features/forms/FormInfo";
import TextAreaInput from "../../../customComponents/TextAreaInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";
import FileInput from "../../../customComponents/FileInput";
import FormHeading from "../../../customComponents/FormHeading";
import FormActionButtons from "@/components/features/FormActionButtons";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useGlobalContext from "@/context/useGlobalContext";
import {
  manualAssetVerificationSchema,
  type ManualAssetVerificationPayload,
  type ManualAssetVerificationRequest,
} from "@/schemas/assetSchemas";
import { useFormSubmit } from "@/hooks/useFormSubmit";
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
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualAssetVerificationRequest>({
    defaultValues: {
      id: selectedRowId ?? "",
      location: "",
      reason: "",
      images: [],
    },
    resolver: zodResolver(manualAssetVerificationSchema),
  });

  const images = useWatch({ control, name: "images" });

  const { submit: verifyManually, isPending } = useFormSubmit<
    ManualAssetVerificationRequest,
    ManualAssetVerificationPayload
  >({
    resourcePath: `api/assets/${selectedRowId ?? ""}/verify-manual`,
    queryKey: ["assets"],
    buildPayload: (values, compressedImages) => ({
      id: selectedRowId ?? values.id,
      location: values.location,
      reason: values.reason,
      images: compressedImages.map((file) => ({
        filename: file.name,
        content_type: file.type,
      })),
    }),
    onSuccess: () => {
      toast.success("Asset manually verified", { duration: 1500 });
      closeDialog();
    },
    onError: () => {
      toast.error("Failed to verify asset manually", { duration: 1500 });
    },
  });

  const closeDialog = () => {
    setShowManualVerificationDialog(false);
    reset();
    navigate("/assets/list");
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
      <DialogContent className="sm:max-w-156 bg-white z-3000 dark:bg-[#1d2739] border-none dark:text-gray-100 dark:border-gray-700/50">
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
          onSubmit={handleSubmit(verifyManually)}
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
            {images.length === 0 && (
              <FormInfo message="Add at least one clear image as evidence of the asset's identity and condition when its barcode cannot be scanned." />
            )}
            <FileInput
              name="images"
              control={control}
              label="Verification Images"
              error={errors.images as FieldError | undefined}
              disabled={isPending}
              required
              multiple
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
