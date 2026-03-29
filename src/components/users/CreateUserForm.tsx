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
    resourcePath: "admin/users",
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
      className="flex flex-col rounded-lg lg:w-full text-(--clr-textLight) dark:bg-(--bg-primary_dark)"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8 w-full">
        <FormHeading
          heading="Profile Information"
          h3={true}
          className="col-span-full text-sm mt-2 pb-4"
        />
        <FormRowInput
          label="Name"
          name="name"
          className="capitalize"
          register={register}
          error={errors.name}
        />
        <FormRowInput
          label="Surname"
          name="family_name"
          register={register}
          className="capitalize"
          error={errors.family_name}
        />
        <FormRowSelect
          label="Location"
          name="location"
          options={allLocations}
          register={register}
          className="capitalize"
          error={errors.location}
        />
        <FormRowSelect
          label="Role"
          name="group"
          options={userRoles}
          register={register}
          className="capitalize"
          error={errors.group}
        />

        <FormHeading
          heading="Contact Information"
          h3={true}
          className="col-span-full text-sm mt-2 pb-4"
        />
        <FormRowInput
          label="Email"
          type="email"
          name="email"
          register={register}
          error={errors.email}
        />
        <FormRowInput
          label="Mobile"
          type="text"
          name="mobile"
          register={register}
          className="capitalize"
          error={errors.mobile}
        />
      </div>

      <div className="flex gap-3 w-full sm:w-auto sm:ml-auto sm:min-w-64 pb-2">
        <Button
          className="flex-1 hover:bg-red-500/90 hover:cursor-pointer hover:text-white capitalize"
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
          className="flex-1 capitalize"
        >
          {isPending ? <Spinner /> : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default CreateUserForm;
