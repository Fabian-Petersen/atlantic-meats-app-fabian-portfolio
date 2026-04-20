// import type { UserAttributes } from "@/schemas";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate } from "react-router-dom";
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
import { Button } from "../ui/button";
import FormHeading from "../../../customComponents/FormHeading";
import FormRowSelect from "@/../customComponents/FormRowSelect";
import { Spinner } from "../ui/spinner";
import { usePOST } from "@/utils/api";
import { toast } from "sonner";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

function CreateUserForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UsersRequestFormValues>({
    resolver: zodResolver(
      usersRequestSchema,
    ) as unknown as Resolver<UsersRequestFormValues>,
  });

  // $ Calling the usePOST hook to fetch the data
  const { mutateAsync, isError, isPending } = usePOST({
    resourcePath: "users",
    queryKey: ["userRequests"],
  });

  const { setShowCreateUserDialog, setShowSuccess, setSuccessConfig } =
    useGlobalContext();

  const onSubmit = async (data: UsersRequestFormValues) => {
    try {
      await mutateAsync(data);
      // console.log(response);

      // $ Close the dialog immediately
      setShowCreateUserDialog(false);

      // $ Wait 1 second before showing the success modal
      setTimeout(() => {
        setSuccessConfig({
          title: "Success",
          message: `User ${data.name} ${data.family_name} successfully created`,
        });
        setShowSuccess(true);
      }, 1000);

      reset();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create user");
    }

    if (isError) {
      return toast.error("Failed to create new user.");
    }
  };

  return (
    <form
      className="flex flex-col lg:w-full gap-4 text-(--clr-textLight) dark:bg-(--bg-primary_dark)"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 md:gap-y-6 w-full">
        <FormHeading
          heading="Profile Information"
          className="col-span-full text-sm"
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
          className="col-span-full text-sm"
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

      <div className={cn(sharedStyles.btnParent)}>
        <Button
          className={cn(sharedStyles.btn, sharedStyles.btnCancel)}
          type="button"
          onClick={() => setShowCreateUserDialog(false)}
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
          {isPending ? (
            <Spinner data-icon="inline-start" className="size-8" />
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}

export default CreateUserForm;
