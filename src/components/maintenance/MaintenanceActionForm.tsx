//$ This component is used to action and closeout a maintenace job, the data is submitted to the database (dynamoDB) referenced to the requested_id.

import { Button } from "@/components/ui/button";
import { useState } from "react";

// $ React-Hook-Form & zod
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Control, type Resolver } from "react-hook-form";

import FormRowInput from "../../../customComponents/FormRowInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";
// import useGlobalContext from "@/context/useGlobalContext";

// $ Import schemas
import { actionJobSchema, type ActionJobFormValues } from "../../schemas/index";

import { ROOT_CAUSES, status } from "@/data/maintenanceAction";
import TextAreaInput from "../../../customComponents/TextAreaInput";
import DigitalSignature from "./DigitalSignature";
import FileInput from "../../../customComponents/FileInput";
//// import FileInput from "../customComponents/FileInput";
type Props = {
  onCancel: () => void;
};

const MaintenanceActionForm = ({ onCancel }: Props) => {
  const [signature, setSignature] = useState<string | null>(null);
  // const { setShowActionDialog } = useGlobalContext();

  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ActionJobFormValues>({
    // defaultValues: {
    // start_km: "",
    // end_km: "",
    // images: [],
    // start_time: toDateTimeLocal(now),
    // end_time: toDateTimeLocal(now),
    // work_completed: "",
    // materials: "",
    // materials_cost: "",
    // status: "",
    // root_cause: "",
    // additional_notes: "",
    // },
    resolver: zodResolver(
      actionJobSchema,
    ) as unknown as Resolver<ActionJobFormValues>,
  });

  const onSubmit = async (data: ActionJobFormValues) => {
    try {
      // //const user = await fetchUserAttributes();
      const payload = {
        ...data,
        signature, // base64 PNG
      };
      console.log(signature);
      //// const response = await mutateAsync(payload);
      console.log("data from actioned request:", payload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      className="flex flex-col rounded-lg lg:w-full text-font dark:bg-[#1d2739] pt-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-6 w-full lg:pt-6">
        <FormRowInput
          label="Start Date/Time"
          type="datetime-local"
          name="start_time"
          placeholder="Start Time"
          register={register}
          error={errors.start_time}
        />
        <FormRowInput
          label="End Date/Time"
          type="datetime-local"
          name="end_time"
          placeholder="End Time"
          register={register}
          error={errors.end_time}
        />
        <FormRowInput
          label="Kilometers"
          type="text"
          name="total_km"
          placeholder="Total Km's"
          register={register}
          error={errors.total_km}
        />
        <FormRowInput
          label="Works Order Number"
          type="text"
          name="works_order_number"
          placeholder="Works Order Number"
          register={register}
          error={errors.works_order_number}
        />
        <FormRowSelect
          label="Root Cause"
          name="root_cause"
          options={ROOT_CAUSES.map((cause) => ({
            label: cause,
            value: cause,
          }))}
          // control={control}
          placeholder="Select type"
          register={register}
          error={errors.root_cause}
        />
        <FormRowSelect
          label="Status"
          name="status"
          options={status}
          className="gap-2"
          // control={control}
          placeholder="Action Status"
          register={register}
          error={errors.status}
        />
        <div className="col-span-full grid grid-cols-2 gap-y-0 gap-x-6">
          <TextAreaInput
            label="Work Completed"
            name="work_completed"
            placeholder="Work Completed"
            register={register}
            className="gap-2"
            rows={3}
            error={errors.work_completed}
          />
          <TextAreaInput
            label="Findings"
            name="findings"
            placeholder="Findings"
            className=""
            register={register}
            rows={3}
            error={errors.findings}
          />
          <FileInput
            label=""
            control={control as unknown as Control<ActionJobFormValues>}
            name="images"
            multiple={true}
            className="col-span-2"
          />
        </div>
      </div>
      <DigitalSignature onSave={setSignature} />
      <div className="flex lg:w-1/2 ml-auto gap-2 max-w-72 sticky bottom-0 bg-white pt-2">
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
