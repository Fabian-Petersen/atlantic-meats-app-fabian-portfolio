//$ This component is used to action and closeout a maintenace job, the data is submitted to the database (dynamoDB) referenced to the requested_id.

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// $ React-Hook-Form & zod
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Control, type Resolver } from "react-hook-form";

import FormRowInput from "../../../customComponents/FormRowInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";
// import useGlobalContext from "@/context/useGlobalContext";

// $ Import schemas
import {
  actionRequestSchema,
  type ActionRequestFormValues,
  type ActionRequestPayload,
  type PresignedUrlResponse,
} from "../../schemas/index";

// $ Import api & hooks
import { useCreateActionRequest } from "@/utils/api";

// $ Import image compression hook
import { compressImagesToWebpv1 } from "@/utils/compressImagesToWebpv1";

import { ROOT_CAUSES, status } from "@/data/maintenanceAction";
import TextAreaInput from "../../../customComponents/TextAreaInput";
import DigitalSignature from "./DigitalSignature";
import FileInput from "../../../customComponents/FileInput";
import useGlobalContext from "@/context/useGlobalContext";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { Spinner } from "../ui/spinner";

type Props = {
  onCancel: () => void;
};

const MaintenanceActionForm = ({ onCancel }: Props) => {
  const { mutateAsync, isError, isPending } = useCreateActionRequest();

  const [signature, setSignature] = useState<string | null>(null);
  const { setShowError, selectedRowId, setShowActionDialog } =
    useGlobalContext();
  const navigate = useNavigate();

  // $ Ensure selectedRowId is available
  useEffect(() => {
    if (!selectedRowId) {
      toast.error("No maintenance request selected for actioning.", {
        duration: 1000,
      });
      navigate(`/jobs/actioned/${selectedRowId}`);
    }
  }, [selectedRowId, navigate]);

  // $ Ensure signature is captured before allowing submission
  useEffect(() => {
    if (signature === null) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [signature, setShowError]);

  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActionRequestFormValues>({
    // defaultValues: {
    // start_time: toDateTimeLocal(now),
    // end_time: toDateTimeLocal(now),
    // total_km: "",
    // works_order_number: "",
    // work_completed: "",
    // status: "",
    // root_cause: "",
    // findings: "",
    // images: [],
    // signature: "",
    // },

    resolver: zodResolver(
      actionRequestSchema,
    ) as unknown as Resolver<ActionRequestFormValues>,
  });

  const onSubmit = async (data: ActionRequestFormValues) => {
    // $ 1. 1️⃣ Compress images in browser
    const originalFiles = data.images ?? [];
    const compressedFiles = await compressImagesToWebpv1(originalFiles);

    try {
      // $ 2. Prepare payload with compressed images and signature
      const payload: ActionRequestPayload = {
        ...data,
        images: compressedFiles.map((file) => ({
          filename: file.name,
          content_type: file.type,
        })),
        signature,
        selectedRowId: selectedRowId!,
      };

      // console.log("data from actioned request:", payload);
      // $ 3. Create maintenance request (DynamoDB + presigned URLs)
      const response = await mutateAsync(payload);

      const { presigned_urls } = response;

      // $ 4. Upload files directly to S3
      await Promise.all(
        presigned_urls.map((item: PresignedUrlResponse[number]) => {
          const file = compressedFiles.find((f) => f.name === item.filename);

          if (!file) return Promise.resolve();

          return fetch(item.url, {
            method: "PUT",
            headers: {
              "Content-Type": "image/webp",
            },
            body: file,
          });
        }),
      );

      toast.success("Request successfully Actioned!", {
        duration: 1000,
      });
      setShowActionDialog(false);
      navigate("/jobs/actioned");
    } catch (err) {
      console.error("Failed to create maintenance request", err);
    }
  };

  useEffect(() => {
    if (isError) {
      setShowError(true);
    }
  }, [isError, setShowError]);

  return (
    <form className={cn(sharedStyles.form)} onSubmit={handleSubmit(onSubmit)}>
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
      <DigitalSignature onSave={setSignature} className="mb-6" />
      <div className="flex w-full">
        <div className={cn(sharedStyles.btnParent)}>
          <Button
            className={cn(sharedStyles.btnCancel, sharedStyles.btn)}
            variant="cancel"
            // size="lg"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            type="submit"
            variant="submit"
            // size="lg"
            className={cn(sharedStyles.btnSubmit, sharedStyles.btn)}
          >
            {isPending ? <Spinner className="size-8" /> : "Submit"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MaintenanceActionForm;
