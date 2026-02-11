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
  actionJobSchema,
  type ActionJobFormValues,
  type CreateActionPayload,
  type PresignedUrlResponse,
} from "../../schemas/index";

// $ Import api & hooks
import { useCreateActionRequest } from "@/utils/api";

// $ Import image compression hook
import { compressImagesToWebp } from "@/utils/compressImagesToWebp";

import { ROOT_CAUSES, status } from "@/data/maintenanceAction";
import TextAreaInput from "../../../customComponents/TextAreaInput";
import DigitalSignature from "./DigitalSignature";
import FileInput from "../../../customComponents/FileInput";
import useGlobalContext from "@/context/useGlobalContext";

type Props = {
  onCancel: () => void;
};

const MaintenanceActionForm = ({ onCancel }: Props) => {
  const { mutateAsync, isError } = useCreateActionRequest();

  const [signature, setSignature] = useState<string | null>(null);
  const { setHasError, selectedRowId } = useGlobalContext();
  const navigate = useNavigate();

  // $ Ensure selectedRowId is available
  useEffect(() => {
    if (!selectedRowId) {
      toast.error("No maintenance request selected for actioning.", {
        duration: 1000,
      });
      navigate("/maintenance-list");
    }
  }, [selectedRowId, navigate]);

  // $ Ensure signature is captured before allowing submission
  useEffect(() => {
    if (signature === null) {
      setHasError(true);
      toast.error("Please provide a digital signature before submitting.", {
        duration: 1000,
      });
    } else {
      setHasError(false);
    }
  }, [signature, setHasError]);

  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ActionJobFormValues>({
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
      actionJobSchema,
    ) as unknown as Resolver<ActionJobFormValues>,
  });

  const onSubmit = async (data: ActionJobFormValues) => {
    // $ 1. 1️⃣ Compress images in browser
    const originalFiles = data.images ?? [];
    const compressedFiles = await compressImagesToWebp(originalFiles);

    try {
      // $ 2. Prepare payload with compressed images and signature
      const payload: CreateActionPayload = {
        ...data,
        images: compressedFiles.map((file) => ({
          filename: file.name,
          content_type: file.type,
        })),
        signature,
        selectedRowId: selectedRowId!,
      };

      console.log("data from actioned request:", payload);
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
      navigate("/maintenance-list");
    } catch (err) {
      console.error("Failed to create maintenance request", err);
    }
  };

  useEffect(() => {
    if (isError) {
      setHasError(true);
    }
  }, [isError, setHasError]);

  return (
    <form
      className="flex flex-col rounded-lg lg:w-full text-font dark:bg-[#1d2739] pt-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-6 w-full">
        <div className="col-span-2 lg:col-span-1">
          <FormRowInput
            label="Start Date/Time"
            type="datetime-local"
            name="start_time"
            placeholder="Start Time"
            register={register}
            error={errors.start_time}
          />
        </div>
        <div className="col-span-2 lg:col-span-1 mt-2 lg:mt-0">
          <FormRowInput
            label="End Date/Time"
            type="datetime-local"
            name="end_time"
            placeholder="End Time"
            register={register}
            error={errors.end_time}
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <FormRowInput
            label="Kilometers"
            type="text"
            name="total_km"
            placeholder="Total Km's"
            register={register}
            error={errors.total_km}
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <FormRowInput
            label="Works Order Number"
            type="text"
            name="works_order_number"
            placeholder="Works Order Number"
            register={register}
            error={errors.works_order_number}
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <FormRowSelect
            label="Root Cause"
            name="root_cause"
            options={ROOT_CAUSES.map((cause) => ({
              label: cause,
              value: cause,
            }))}
            placeholder="Select type"
            register={register}
            error={errors.root_cause}
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <FormRowSelect
            label="Status"
            name="status"
            options={status}
            className="gap-2"
            placeholder="Action Status"
            register={register}
            error={errors.status}
          />
        </div>
        <TextAreaInput
          label="Work Completed"
          name="work_completed"
          placeholder="Work Completed"
          register={register}
          className="col-span-2"
          rows={1}
          error={errors.work_completed}
        />
        <TextAreaInput
          label="Findings"
          name="findings"
          placeholder="Findings"
          className="col-span-2"
          register={register}
          rows={1}
          error={errors.findings}
        />
      </div>
      <FileInput
        label=""
        control={control as unknown as Control<ActionJobFormValues>}
        name="images"
        multiple={true}
        className="col-span-2 mt-2"
      />
      <DigitalSignature onSave={setSignature} className="mt-6" />
      <div className="flex lg:w-1/2 ml-auto gap-2 max-w-72 bg-white mt-auto">
        <Button
          className="flex-1 hover:bg-red-500/90 hover:cursor-pointer hover:text-white"
          variant="cancel"
          size="lg"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          disabled={isSubmitting}
          type="submit"
          variant="submit"
          size="lg"
          className="flex-1"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default MaintenanceActionForm;
