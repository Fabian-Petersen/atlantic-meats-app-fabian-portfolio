// import type { UserAttributes } from "@/schemas";
import FormRowInput from "../../../customComponents/FormRowInput";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormHeading from "../../../customComponents/FormHeading";
import FormRowInputEditable from "../../../customComponents/FormRowInputEditable";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  usersRequestSchema,
  type UserUpdateRequest,
  type UsersRequestFormValues,
} from "@/schemas";
// import { useUserAttributes } from "../../utils/aws-userAttributes";
import { getUserGroups } from "@/auth/getUserGroups";
import { useEffect } from "react";
import { useUpdateItem } from "@/utils/api";
import { Spinner } from "../ui/spinner";
import useGlobalContext from "@/context/useGlobalContext";

type UserProfileProps = {
  user: UserUpdateRequest | null;
};

// Type passed into component = UsersAPIResponse

function StoreProfileForm({ user }: UserProfileProps) {
  const navigate = useNavigate();
  const { setShowSuccess, setSuccessConfig } = useGlobalContext();

  useEffect(() => {
    const loadGroups = async () => {
      const groups = await getUserGroups();
      return groups;
    };
    loadGroups();
  }, []);

  const { mutateAsync: updateItem, isPending } = useUpdateItem({
    resourcePath: "admin/users",
    queryKey: ["userRequests", "user"],
  });

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    getValues,
  } = useForm<UsersRequestFormValues>({
    defaultValues: user ?? undefined,
    resolver: zodResolver(
      usersRequestSchema,
    ) as unknown as Resolver<UsersRequestFormValues>,
  });

  if (!user) return null;

  const onSubmit = async () => {
    const values = getValues();

    const payload = Object.keys(dirtyFields).reduce((acc, key) => {
      acc[key as keyof UsersRequestFormValues] =
        values[key as keyof UsersRequestFormValues];
      return acc;
    }, {} as Partial<UsersRequestFormValues>);

    console.log(payload);

    setSuccessConfig({ message: `Sucessfully updated user ${user.name}` });
    setShowSuccess(true);
    navigate("/admin/users");
    try {
      await updateItem({ id: user.id ?? "", payload: payload });
    } catch (error) {
      console.log(error);
    }
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
        <FormRowInput
          label="Surname"
          name="family_name"
          readOnly={true}
          register={register}
          className="capitalize"
        />
        <FormRowInputEditable
          label="Location"
          name="location"
          register={register}
          className="capitalize"
        />
        <FormRowInputEditable
          label="Group"
          name="group"
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
          error={errors.mobile}
        />
      </div>
      <div className="flex lg:w-1/2 ml-auto gap-2 max-w-72 bg-white pb-4">
        <Button
          className="flex-1 hover:bg-red-500/90 hover:cursor-pointer hover:text-white capitalize"
          type="button"
          onClick={() => navigate("/admin/users")}
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
          {isPending ? <Spinner className="w-8 h-8" /> : "Update"}
        </Button>
      </div>
    </form>
  );
}

export default StoreProfileForm;
