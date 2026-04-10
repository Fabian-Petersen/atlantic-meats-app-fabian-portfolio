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
      className="flex flex-col lg:w-full text-(--clr-textLight) dark:bg-(--bg-primary_dark) border border-red-500 border-dashed"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 md:gap-y-8 w-full">
        <FormHeading
          heading="Profile Information"
          h3={true}
          className="col-span-full text-sm"
        />
        <FormRowInput
          label=""
          name="name"
          placeholder="Name"
          className="capitalize"
          register={register}
          error={errors.name}
        />
        <FormRowInput
          label=""
          name="family_name"
          placeholder="surname"
          register={register}
          className="capitalize"
          error={errors.family_name}
        />
        <FormRowSelect
          label=""
          name="location"
          placeholder="Location"
          options={allLocations}
          register={register}
          className="capitalize"
          error={errors.location}
        />
        <FormRowSelect
          label=""
          name="group"
          placeholder="Role"
          options={userRoles}
          register={register}
          className="capitalize"
          error={errors.group}
        />

        <FormHeading
          heading="Contact Information"
          h3={true}
          className="col-span-full text-sm md:mt-2 md:pb-4"
        />
        <FormRowInput
          label=""
          type="email"
          name="email"
          placeholder="email"
          register={register}
          error={errors.email}
        />
        <FormRowInput
          label=""
          type="text"
          name="mobile"
          placeholder="mobile number"
          register={register}
          className="capitalize"
          error={errors.mobile}
        />
      </div>

      <div className="flex justify-between w-full gap-2 mt-auto">
        <Button
          className="flex-1 py-2 text-xs font-medium rounded-lg border border-red-200 dark:border-red-500 text-red-600 dark:bg-red-300/20 dark:text-red-300 hover:bg-gray-50 dark:hover:bg-red/5 transition-colors"
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
          className="flex-1 py-2 text-xs font-medium rounded-lg border border-primary bg-primary/20 dark:border-primary text-primary dark:bg-primary/20 dark:text-primary hover:bg-primary/50 dark:hover:bg-primary/5 transition-colors"
        >
          {isPending ? (
            <div className="flex gap-4 items-center justify-center">
              <Spinner data-icon="inline-start" className="size-6" />
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}

export default CreateUserForm;
