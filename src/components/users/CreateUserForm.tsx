import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
// $ Types
import { type UsersRequestFormValues, usersRequestSchema } from "@/schemas";

// $ Select Form Data
import { allLocations } from "@/data/stores";
import { userRoles, userPosition } from "@/data/userRoles";

// $ Context
import useGlobalContext from "@/context/useGlobalContext";

// $ Components
import FormRowInput from "../../../customComponents/FormRowInput";
import FormHeading from "../../../customComponents/FormHeading";
import FormRowSelect from "@/../customComponents/FormRowSelect";
import FormActionButtons from "../features/FormActionButtons";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

function CreateUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsersRequestFormValues>({
    resolver: zodResolver(
      usersRequestSchema,
    ) as unknown as Resolver<UsersRequestFormValues>,
    defaultValues: {
      email: "",
      group: "",
      family_name: "",
      name: "",
      position: "",
      location: "",
      mobile: "",
    },
  });

  const navigate = useNavigate();

  const {
    setShowCreateUserDialog,
    setShowError,
    setShowSuccess,
    setSuccessConfig,
    setErrorConfig,
  } = useGlobalContext();

  const { submit, isPending } = useFormSubmit({
    resourcePath: "api/users",
    queryKey: ["users"],
    buildPayload: (values) => values,
    onSuccess: (values) => {
      setShowCreateUserDialog(false);
      setTimeout(() => {
        setSuccessConfig({
          title: "Success",
          message: `${values.name} ${values.family_name} was created.`,
          redirectPath: "users",
        });
        setShowSuccess(true);
      }, 1000);
    },
    onError: () => {
      setErrorConfig({
        title: "User Creation Failed",
        message: "Could not create the user. Please try again.",
        redirectPath: "users",
      });
      setShowError(true);
    },
  });

  return (
    <form
      className={cn(sharedStyles.form, "gap-4")}
      onSubmit={handleSubmit(submit)}
    >
      <div className={cn(sharedStyles.formParent, "gap-6 md:gap-4")}>
        <FormHeading
          heading="Profile Information"
          className={cn(
            sharedStyles.headingForm,
            "text-left text-xs md:text-sm p-0 col-span-full",
          )}
        />
        <FormRowInput
          // label=""
          name="name"
          label="Name"
          className="capitalize"
          register={register}
          error={errors.name}
          required={true}
        />
        <FormRowInput
          // label=""
          name="family_name"
          label="surname"
          register={register}
          className="capitalize"
          error={errors.family_name}
          required={true}
        />
        <FormRowSelect
          // label=""
          name="location"
          label="Location"
          options={allLocations}
          register={register}
          className="capitalize"
          error={errors.location}
          required={true}
        />
        <FormRowSelect
          // label=""
          name="group"
          label="Group"
          options={userRoles}
          register={register}
          className=""
          error={errors.group}
          required={true}
        />
        <FormRowSelect
          // label=""
          name="position"
          label="Position"
          options={userPosition}
          register={register}
          className="capitalize"
          error={errors.position}
          required={true}
        />
        <FormHeading
          heading="Contact Information"
          className={cn(
            sharedStyles.headingForm,
            "text-left text-xs md:text-sm p-0 col-span-full",
          )}
        />
        <FormRowInput
          // label=""
          type="email"
          name="email"
          label="email"
          register={register}
          error={errors.email}
        />
        <FormRowInput
          // label=""
          type="text"
          name="mobile"
          label="mobile number"
          register={register}
          className="capitalize"
          error={errors.mobile}
        />
      </div>
      <FormActionButtons
        onCancel={() => navigate("/users")}
        cancelText="Cancel"
        submitText="Submit"
        isPending={isPending}
      />
    </form>
  );
}

export default CreateUserForm;
