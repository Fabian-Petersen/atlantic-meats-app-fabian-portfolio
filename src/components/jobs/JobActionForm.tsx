//$ This component is used to action and closeout a maintenace job, the data is submitted to the database (dynamoDB) referenced to the requested_id.

// import { Button } from "@/components/ui/button";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// $ React-Hook-Form & zod
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Control, type Resolver } from "react-hook-form";
import { Controller } from "react-hook-form";

import FormRowInput from "../../../customComponents/FormRowInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";

// $ Import schemas
import {
  actionRequestSchema,
  // type ActionAPIResponse,
  type ActionRequestFormValues,
  // type ActionRequestPayload,
  // type PresignedUrlResponse,
} from "../../schemas/index";

// $ Import api & hooks
// import { usePOST } from "@/utils/api";

// $ Import image compression hook
// import { compressImagesToWebpv1 } from "@/utils/compressImagesToWebpv1";

import { ROOT_CAUSES, status } from "@/data/maintenanceAction";
import TextAreaInput from "../../../customComponents/TextAreaInput";
import DigitalSignature from "./DigitalSignature";
import FileInput from "../../../customComponents/FileInput";
import useGlobalContext from "@/context/useGlobalContext";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
// import { Spinner } from "../ui/spinner";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import FormActionButtons from "../features/FormActionButtons";

type Props = {
  onCancel: () => void;
};

/**
 * JobActionForm
 * Path: Child of JobActionPage"/jobs/:id/action"
 *
 * Purpose:
 * - Handles the actioning and closeout of a maintenance job.
 * - Collects job completion data, uploads supporting images, and captures a digital signature.
 *
 * Responsibilities:
 * - Manages form state and validation using React Hook Form and Zod.
 * - Compresses images before upload to optimise performance.
 * - Submits structured job action data to the backend (DynamoDB).
 * - Uploads images directly to S3 using presigned URLs.
 * - Handles success and error feedback via toast notifications.
 *
 * Behavior:
 * - Prevents submission if no maintenance request is selected.
 * - Requires a digital signature before allowing submission.
 * - Displays loading state during submission.
 * - On success:
 *   - Closes the action dialog.
 *   - Redirects user to "/jobs/completed".
 * - On error:
 *   - Triggers global error state and displays feedback.
 *
 * Props:
 * - onCancel: Callback triggered when the user cancels the form.
 *
 * Data Flow:
 * - Reads selectedRowId and global UI state from context.
 * - Sends action payload via usePOST hook.
 * - Receives presigned URLs for direct S3 uploads.
 *
 * Dependencies:
 * - React Hook Form + Zod (form state & validation)
 * - usePOST (API interaction)
 * - compressImagesToWebpv1 (client-side image optimisation)
 * - Global context (state management)
 * - Custom form components (inputs, selects, file upload, signature)
 */

const JobActionForm = ({ onCancel }: Props) => {
  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActionRequestFormValues>({
    resolver: zodResolver(
      actionRequestSchema,
    ) as unknown as Resolver<ActionRequestFormValues>,
  });

  const {
    selectedRowId,
    setShowActionDialog,
    setSuccessConfig,
    setErrorConfig,
    setShowError,
    setShowSuccess,
  } = useGlobalContext();
  // const navigate = useNavigate();

  // $ Hook that handles the file compression and form submission to backend with success and error modals
  const { submit, isPending } = useFormSubmit({
    id: selectedRowId ?? "",
    resourcePath: "jobs",
    queryKey: ["jobs", "action-job"],
    action: "action",
    buildPayload: (values, compressed) => ({
      ...values,
      selectedRowId: selectedRowId, // id expected by the backend
      images: compressed.map((f) => ({
        filename: f.name,
        content_type: f.type,
      })),
    }),
    onSuccess: () => {
      setShowActionDialog(false);
      setSuccessConfig({
        title: "Job Created",
        message: "Job completion successfully submitted.",
        redirectPath: "jobs/completed",
      });
      setShowSuccess(true);
    },
    onError: () => {
      setErrorConfig({
        title: "Submission Failed",
        message: "Could not close the job. Please try again.",
        redirectPath: "jobs/in-progress",
      });
      setShowError(true);
    },
  });

  // $ Import POST hook for submitting the actioned maintenance request to the backend (DynamoDB + S3 for images)
  // const { mutateAsync: postAction, isPending } = usePOST<
  //   ActionRequestPayload,
  //   ActionAPIResponse
  // >({
  //   id: selectedRowId ?? "",
  //   resourcePath: "jobs",
  //   queryKey: ["jobs", "action-job"],
  //   action: "action",
  // });

  // // $ Ensure selectedRowId is available
  // useEffect(() => {
  //   if (!selectedRowId) {
  //     toast.error("No maintenance request selected for actioning.", {
  //       duration: 1000,
  //     });
  //     navigate(`/jobs/${selectedRowId}/action`);
  //   }
  // }, [selectedRowId, navigate]);

  // const onSubmit = async (data: ActionRequestFormValues) => {
  //   // $ 1. 1️⃣ Compress images in browser
  //   const originalFiles = data.images ?? [];
  //   const compressedFiles = await compressImagesToWebpv1(originalFiles);

  //   try {
  //     // $ 2. Prepare payload with compressed images and signature
  //     const payload: ActionRequestPayload = {
  //       ...data,
  //       images: compressedFiles.map((file) => ({
  //         filename: file.name,
  //         content_type: file.type,
  //       })),
  //       signature: data.signature,
  //       selectedRowId: selectedRowId!,
  //     };

  //     console.log("payload:", payload);

  //     // $ 3. Create maintenance request (DynamoDB + presigned URLs)
  //     const response = await postAction(payload);
  //     const presigned_urls = response.presigned_urls;
  //     // type guard
  //     if (!presigned_urls?.length) {
  //       return;
  //     }

  //     // $ 4. Upload files directly to S3
  //     await Promise.all(
  //       presigned_urls.map((item: PresignedUrlResponse[number]) => {
  //         const file = compressedFiles.find((f) => f.name === item.filename);

  //         if (!file) return Promise.resolve();

  //         return fetch(item.url, {
  //           method: "PUT",
  //           headers: {
  //             "Content-Type": "image/webp",
  //           },
  //           body: file,
  //         });
  //       }),
  //     );

  //     toast.success("Request successfully Actioned!", {
  //       duration: 1000,
  //     });
  //     setShowActionDialog(false);
  //     navigate("/jobs/completed");
  //   } catch (err) {
  //     toast.error("Request unsuccessfull!!", {
  //       duration: 1000,
  //     });
  //     console.error("Failed to create maintenance request", err);
  //   }
  // };

  return (
    <form className={cn(sharedStyles.form)} onSubmit={handleSubmit(submit)}>
      <div className={cn(sharedStyles.formParent)}>
        <FormRowInput
          label="Start Date/Time"
          type="datetime-local"
          name="start_time"
          placeholder=""
          register={register}
          className="col-span-2 md:col-span-1 mt-1"
          error={errors.start_time}
        />
        <FormRowInput
          label="End Date/Time"
          type="datetime-local"
          name="end_time"
          placeholder=""
          register={register}
          className="col-span-2 md:col-span-1 mt-2"
          error={errors.end_time}
        />
        <FormRowInput
          // label="Kilometers"
          type="text"
          name="total_km"
          placeholder="Total Km's"
          register={register}
          className="col-span-2 md:col-span-1"
          error={errors.total_km}
        />
        <FormRowInput
          // label="Work Order Number"
          type="text"
          name="work_order_number"
          placeholder="Work Order Number"
          register={register}
          className="col-span-2 md:col-span-1"
          error={errors.work_order_number}
        />
        <FormRowSelect
          // label="Root Cause"
          name="root_cause"
          options={ROOT_CAUSES.map((cause) => ({
            label: cause,
            value: cause,
          }))}
          placeholder="Root Cause"
          register={register}
          className="col-span-2 md:col-span-1"
          error={errors.root_cause}
        />
        <FormRowSelect
          // label="Status"
          name="status"
          options={status}
          placeholder="Job Status"
          register={register}
          className="col-span-2 md:col-span-1"
          error={errors.status}
        />
        <TextAreaInput
          // label="Work Completed"
          name="work_completed"
          placeholder="Work Completed"
          register={register}
          className="col-span-2"
          rows={1}
          error={errors.work_completed}
        />
        <TextAreaInput
          // label="Findings"
          name="findings"
          placeholder="Findings"
          className="col-span-2"
          register={register}
          rows={1}
          error={errors.findings}
        />
        <FileInput
          label=""
          control={control as unknown as Control<ActionRequestFormValues>}
          name="images"
          multiple={true}
          className="col-span-2"
        />
        <FormRowInput
          name="signedBy"
          placeholder="signed by"
          className="col-span-2"
          register={register}
          error={errors.signedBy}
        />
      </div>
      <Controller
        name="signature"
        control={control}
        render={({ field, fieldState }) => (
          <DigitalSignature
            value={field.value}
            onSave={field.onChange}
            onClear={() => field.onChange("")}
            className="mb-6"
            error={fieldState.error}
          />
        )}
      />
      <FormActionButtons
        onCancel={onCancel}
        cancelText="Cancel"
        submitText="Submit"
        isPending={isPending}
      />
    </form>
  );
};

export default JobActionForm;
