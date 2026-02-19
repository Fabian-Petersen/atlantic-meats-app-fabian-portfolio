// import type { UserAttributes } from "@/schemas";
import FormRowInput from "../../../customComponents/FormRowInput";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UserAttributesFormValues, userAttributesSchema } from "@/schemas";
import FormHeading from "../../../customComponents/FormHeading";
import FormRowInputEditable from "../../../customComponents/FormRowInputEditable";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import type { UserAttributes } from "@/schemas";
// import { useUserAttributes } from "../../utils/aws-userAttributes";

type UserProfileProps = {
  user: UserAttributes | null;
};

function UserProfileForm({ user }: UserProfileProps) {
  // todo: Add the additional user attributes to Cognito
  // const { data: user } = useUserAttributes();
  // console.log(user);

  // const userTest = {
  //   name: user?.name ?? "",
  //   email: user?.email,
  //   surname: user?.family_name,
  //   role: "admin",
  //   mobile: "0713860827",
  //   branch: "distribution",
  //   division: "central services",
  // };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UserAttributesFormValues>({
    defaultValues: user ?? undefined,
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
      className="flex flex-col rounded-lg lg:w-full text-font dark:bg-[#1d2739] pt-4 h-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-6 w-full lg:py-6">
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
          name="family_name"
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
      </div>
      <div className="flex lg:w-1/2 ml-auto gap-2 max-w-72 bg-white pb-4">
        <Button
          className="flex-1 hover:bg-red-500/90 hover:cursor-pointer hover:text-white capitalize"
          type="button"
          onClick={() => navigate("/dashboard")}
          variant="cancel"
          size="lg"
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
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
}

export default UserProfileForm;
