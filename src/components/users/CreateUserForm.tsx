// import type { UserAttributes } from "@/schemas";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
// import { getUserGroups } from "@/auth/getUserGroups";
// import { useEffect } from "react";
// $ Types
import { type UsersRequestFormValues, usersRequestSchema } from "@/schemas";

// $ Select Form Data
import { allLocations } from "@/data/stores";
import { userRoles } from "@/data/userRoles";

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
    resourcePath: "users",
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

  // $ Calling the usePOST hook to fetch the data
  // const { mutateAsync, isError, isPending } = usePOST({
  //   resourcePath: "users",
  //   queryKey: ["userRequests"],
  // });

  // const onSubmit = async (data: UsersRequestFormValues) => {
  //   try {
  //     await mutateAsync(data);
  //     // console.log(response);

  //     // $ Close the dialog immediately
  //     setShowCreateUserDialog(false);

  //     // $ Wait 1 second before showing the success modal
  //     setTimeout(() => {
  //       setSuccessConfig({
  //         title: "Success",
  //         message: `User ${data.name} ${data.family_name} successfully created`,
  //       });
  //       setShowSuccess(true);
  //     }, 1000);

  //     reset();
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed to create user");
  //   }

  //   if (isError) {
  //     return toast.error("Failed to create new user.");
  //   }
  // };

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
          placeholder="Name"
          className="capitalize"
          register={register}
          error={errors.name}
        />
        <FormRowInput
          // label=""
          name="family_name"
          placeholder="surname"
          register={register}
          className="capitalize"
          error={errors.family_name}
        />
        <FormRowSelect
          // label=""
          name="location"
          placeholder="Location"
          options={allLocations}
          register={register}
          className="capitalize"
          error={errors.location}
        />
        <FormRowSelect
          // label=""
          name="group"
          placeholder="Group"
          options={userRoles}
          register={register}
          className="capitalize"
          error={errors.group}
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
          placeholder="email"
          register={register}
          error={errors.email}
        />
        <FormRowInput
          // label=""
          type="text"
          name="mobile"
          placeholder="mobile number"
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
