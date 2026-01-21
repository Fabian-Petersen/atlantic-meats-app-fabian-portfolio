import type { UserAttributes } from "@/schemas";
import FormRowInput from "../../../customComponents/FormRowInput";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UserAttributesFormValues, userAttributesSchema } from "@/schemas";
import FormHeading from "../../../customComponents/FormHeading";
import FormRowInputEditable from "../../../customComponents/FormRowInputEditable";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

type UserProfileProps = {
  user: UserAttributes | null;
};

function UserProfileForm({ user }: UserProfileProps) {
  // todo: Add the additional user attributes to Cognito
  const userTest = {
    name: "fabian",
    email: "fpetersen2tech@gmail.com",
    surname: "petersen",
    role: "admin",
    mobile: "0713860827",
    branch: "distribution",
    division: "central services",
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UserAttributesFormValues>({
    defaultValues: userTest,
    resolver: zodResolver(
      userAttributesSchema,
    ) as unknown as Resolver<UserAttributesFormValues>,
  });

  const navigate = useNavigate();

  if (!user) return null;

  const onSubmit = (data: UserAttributesFormValues) => {
    console.log(data);
  };

  return (
    <form
      className="grid md:grid-cols-2 gap-8 py-4 text-xs border border-red-500"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormHeading
        heading="Profile Information"
        className="col-span-full text-md lg:text-md"
      />
      <FormRowInputEditable
        label="Name"
        name="name"
        className="capitalize"
        register={register}
      />
      {/* <FormRowInput
        label="Name"
        name="name"
        className="capitalize"
        register={register}
      /> */}
      <FormRowInput
        label="Surname"
        name="surname"
        readOnly={true}
        register={register}
        className="capitalize"
      />
      <FormRowInputEditable
        label="Branch"
        name="branch"
        register={register}
        className="capitalize"
      />
      <FormRowInputEditable
        label="Division"
        name="division"
        register={register}
        className="capitalize"
      />
      <FormRowInputEditable
        label="Role"
        name="role"
        register={register}
        className="capitalize"
        // errors={error}
      />
      <FormHeading
        heading="Contact Information"
        className="col-span-full text-md lg:text-md"
      />
      <FormRowInput
        label="Email"
        type="email"
        name="email"
        readOnly={true}
        register={register}
      />
      <FormRowInputEditable
        label="Mobile"
        type="text"
        name="mobile"
        register={register}
        className="capitalize"
      />
      <div className="justify-end flex w-full ml-auto gap-2 max-w-72 mt-auto border border-red-500">
        <Button
          type="button"
          onClick={() => navigate("/dashboard")}
          variant="cancel"
          size="lg"
          className="flex-1 hover:bg-red-500/90 hover:cursor-pointer hover:text-white capitalize"
        >
          Cancel
        </Button>
        <Button
          disabled={isSubmitting}
          type="submit"
          variant="submit"
          size="lg"
          className="flex-1 capitalize"
        >
          Update
        </Button>
      </div>
    </form>
  );
}

export default UserProfileForm;
