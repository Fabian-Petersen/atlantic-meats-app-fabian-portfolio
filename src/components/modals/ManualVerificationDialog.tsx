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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <DialogContent className="top-auto bottom-0 left-0 max-h-[92dvh] max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-t-3xl rounded-b-none border-none bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:bg-[#1d2739] dark:text-gray-100 dark:border-gray-700/50 z-3000 sm:top-[50%] sm:bottom-auto sm:left-[50%] sm:max-w-156 sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg sm:p-6">
        <div className="flex justify-center items-center">
          <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-950/50 dark:text-green-400 md:p-4">
            <ShieldCheck className="size-9 md:size-16" aria-hidden="true" />
          </div>
        </div>
        <DialogTitle className="pt-2 md:py-4">
          <FormHeading
            arial-label="manual asset verification modal"
            headingStyles="justify-center"
            className="font-normal"
            heading="Manual Verification"
          />
        </DialogTitle>
        <DialogDescription className="-mt-2 text-center text-xs leading-5 md:text-sm">
          Confirm the asset's current location and add photographic evidence.
        </DialogDescription>
        <form
          id="manual-verification-form"
          className="flex flex-col rounded-lg w-full text-(--clr-font) dark:bg-[#1d2739]"
          onSubmit={handleSubmit(verifyManually)}
        >
          <div className="grid gap-4 md:gap-5">
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
            showCancelOnMobile
            className="sticky bottom-0 z-10 mt-2 bg-white py-3 dark:bg-[#1d2739] md:static md:bg-transparent md:py-0 dark:md:bg-transparent"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualVerificationDialog;
