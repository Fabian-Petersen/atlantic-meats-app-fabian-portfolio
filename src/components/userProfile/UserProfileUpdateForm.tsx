// type Props = { className?: string };
// import { Button } from "@/components/ui/button";

//$ This component is used to action and closeout a maintenace job, the data is submitted to the database (dynamoDB) referenced to the requested_id.

// $ React-Hook-Form & zod
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import FormRowInput from "../../../customComponents/FormRowInput";
// import useGlobalContext from "@/context/useGlobalContext";

// $ Import schemas
import {
  type UserAttributesFormValues,
  userAttributesSchema,
} from "../../schemas/index";
import { useUserAttributes } from "@/utils/aws-userAttributes";
import FormActionButtons from "../features/FormActionButtons";

function UserProfileUpdateForm() {
  const { data: user } = useUserAttributes();
  // $ Form Schema
  const {
    register,
    handleSubmit,
    // control,
    formState: { errors, isSubmitting },
  } = useForm<UserAttributesFormValues>({
    defaultValues: { name: user?.name, email: user?.email },
    resolver: zodResolver(
      userAttributesSchema,
    ) as unknown as Resolver<UserAttributesFormValues>,
  });

  const onSubmit = async (user: UserAttributesFormValues) => {
    console.log("Submit the data for update:", user);
  };

  return (
    <form
      className="flex flex-col rounded-lg lg:w-full text-font dark:bg-[#1d2739] pt-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-6 w-full lg:pt-2 lg:pb-8">
        <FormRowInput
          label="Name"
          name="name"
          register={register}
          error={errors.name}
        />
        <FormRowInput
          label="Email"
          type="email"
          name="email"
          register={register}
          error={errors.email}
        />
      </div>
      <FormActionButtons
        disabled={isSubmitting}
        redirect="/user-profile"
        redirectText="cancel"
        actionText="update"
      />
    </form>
  );
}
export default UserProfileUpdateForm;
