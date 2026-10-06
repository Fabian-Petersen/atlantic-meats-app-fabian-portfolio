// import type { UserAttributes } from "@/schemas";
import FormRowInput from "../../../customComponents/FormRowInput";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UsersRequestFormValues, userAttributesSchema } from "@/schemas";
import FormHeading from "../../../customComponents/FormHeading";
import FormRowInputEditable from "../../../customComponents/FormRowInputEditable";
import type { UsersAPIResponse } from "@/schemas";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { usePOST } from "@/utils/api";
import useGlobalContext from "@/context/useGlobalContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import FormActionButtons from "../features/FormActionButtons";

type UserProfileProps = {
  user: UsersAPIResponse | null;
};

function UserProfileForm({ user }: UserProfileProps) {
  const { setSuccessConfig, setShowSuccess } = useGlobalContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UsersRequestFormValues>({
    defaultValues: user ?? undefined,
    resolver: zodResolver(
      userAttributesSchema,
    ) as unknown as Resolver<UsersRequestFormValues>,
  });

  const { mutateAsync: editUser, isPending } = usePOST({
    resourcePath: "api/users",
    queryKey: ["users", "update-user"],
  });

  if (!user) return null;

  const onSubmit = async (data: UsersRequestFormValues) => {
    try {
      const payload = {} as UsersRequestFormValues;
      if (data.mobile !== user.mobile) payload.mobile = data.mobile;

      await editUser(payload);
      setSuccessConfig({
        message: "Profile Updated",
        redirectPath: "users/profile",
      });
      setShowSuccess(true);
    } catch (error) {
      console.log("Error updating user profile:", error);
      toast.error("An error occurred while updating the profile");
    }
  };

  return (
    <form
      className={cn(sharedStyles.form, "gap-4")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={cn(sharedStyles.formParent, "gap-6.5 md:gap-8")}>
        <FormHeading
          heading="Profile Information"
          className={cn(
            sharedStyles.headingForm,
            "text-left text-xs md:text-sm p-0 col-span-full",
          )}
        />
        <FormRowInput
          label="Name"
          name="name"
          inputStyles="capitalize"
          readOnly={true}
          register={register}
          control={control}
        />
        <FormRowInput
          label="Surname"
          name="family_name"
          readOnly={true}
          register={register}
          inputStyles="capitalize"
          control={control}
        />
        <FormRowInput
          label="Location"
          name="location"
          readOnly={true}
          register={register}
          inputStyles="capitalize"
          control={control}
        />
        <FormRowInput
          label="Group"
          name="group"
          readOnly={true}
          register={register}
          inputStyles="capitalize"
          control={control}
        />
        <FormRowInput
          label="Position"
          name="position"
          readOnly={true}
          register={register}
          inputStyles="capitalize"
          control={control}
        />
        <FormHeading
          heading="Contact Information"
          className={cn(
            sharedStyles.headingForm,
            "text-left text-xs md:text-sm p-0 col-span-full",
          )}
        />
        <FormRowInput
          label="Email"
          type="email"
          name="email"
          readOnly={true}
          register={register}
          control={control}
        />
        <FormRowInputEditable
          label="Mobile Number"
          type="text"
          name="mobile"
          register={register}
          className="capitalize"
          error={errors.mobile}
        />
      </div>
      <FormActionButtons
        cancelText="Cancel"
        isPending={isPending}
        onCancel={() => navigate("/dashboard")}
        submitText="Update"
      />
    </form>
  );
}

export default UserProfileForm;
