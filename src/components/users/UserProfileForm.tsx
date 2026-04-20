// import type { UserAttributes } from "@/schemas";
import FormRowInput from "../../../customComponents/FormRowInput";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UsersRequestFormValues, userAttributesSchema } from "@/schemas";
import FormHeading from "../../../customComponents/FormHeading";
import FormRowInputEditable from "../../../customComponents/FormRowInputEditable";
import { Button } from "../ui/button";
import type { UsersAPIResponse } from "@/schemas";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { Spinner } from "../ui/spinner";
import { usePOST } from "@/utils/api";
import useGlobalContext from "@/context/useGlobalContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type UserProfileProps = {
  user: UsersAPIResponse | null;
};

function UserProfileForm({ user }: UserProfileProps) {
  const { setSuccessConfig, setShowSuccess } = useGlobalContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsersRequestFormValues>({
    defaultValues: user ?? undefined,
    resolver: zodResolver(
      userAttributesSchema,
    ) as unknown as Resolver<UsersRequestFormValues>,
  });

  const { mutateAsync: editUser, isPending } = usePOST({
    resourcePath: "users",
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
            "text-left text-sm p-0 font-medium",
          )}
        />
        <FormRowInput
          label="Name"
          name="name"
          // placeholder="Name"
          className="capitalize"
          readOnly={true}
          register={register}
        />
        <FormRowInput
          label="Surname"
          name="family_name"
          // placeholder="Surname"
          readOnly={true}
          register={register}
          className="capitalize"
        />
        <FormRowInput
          label="Location"
          name="location"
          readOnly={true}
          register={register}
          className="capitalize"
        />
        <FormRowInput
          label="Group"
          name="group"
          // placeholder="Group"
          readOnly={true}
          register={register}
          className="capitalize"
          // errors={error}
        />
        <FormHeading
          heading="Contact Information"
          className={cn(sharedStyles.headingForm, "text-left text-sm p-0")}
        />
        <FormRowInput
          label="Email"
          type="email"
          name="email"
          // placeholder="Email"
          readOnly={true}
          register={register}
        />
        <FormRowInputEditable
          label="Mobile Number"
          type="text"
          name="mobile"
          // placeholder="Mobile Number"
          register={register}
          className="capitalize"
          error={errors.mobile}
        />
      </div>
      <div className={cn(sharedStyles.btnParent)}>
        <Button
          className={cn(sharedStyles.btn, sharedStyles.btnCancel)}
          type="button"
          onClick={() => navigate("/dashboard")}
          variant="cancel"
          size="lg"
        >
          Cancel
        </Button>
        <Button
          disabled={isPending}
          type="submit"
          variant="submit"
          size="lg"
          className={cn(sharedStyles.btn, sharedStyles.btnSubmit)}
        >
          {isPending ? <Spinner className="size-8" /> : "Update"}
        </Button>
      </div>
    </form>
  );
}

export default UserProfileForm;
