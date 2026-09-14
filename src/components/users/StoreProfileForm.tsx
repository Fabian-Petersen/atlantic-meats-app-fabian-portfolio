// import type { UserAttributes } from "@/schemas";
import FormRowInput from "../../../customComponents/FormRowInput";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormHeading from "../../../customComponents/FormHeading";
import FormRowInputEditable from "../../../customComponents/FormRowInputEditable";
import { useNavigate } from "react-router-dom";
import {
  usersRequestSchema,
  type UserUpdateRequest,
  type UsersRequestFormValues,
} from "@/schemas";
// import { useUserAttributes } from "../../utils/aws-userAttributes";
import { getUserGroups } from "@/auth/getUserGroups";
import { useEffect } from "react";
import { useUpdateItem } from "@/utils/api";
import useGlobalContext from "@/context/useGlobalContext";
import FormActionButtons from "../features/FormActionButtons";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

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
    resourcePath: "users",
    queryKey: ["userRequests", "user"],
  });

  const {
    register,
    handleSubmit,
    control,
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
    navigate("/users");
    try {
      await updateItem({ id: user.id ?? "", payload: payload });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className={cn(
        sharedStyles.form,
        "gap-4 dark:bg-(--pageDark) md:dark:bg-transparent",
      )}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        className={cn(
          sharedStyles.formParent,
          "gap-4 md:gap-6 dark:bg-(--pageDark) md:dark:bg-transparent",
        )}
      >
        <section className="col-span-full grid grid-cols-1 gap-4 rounded-xl md:border-none border border-gray-200/80 bg-white p-2 shadow-sm md:grid-cols-2 md:gap-6 dark:border-gray-700/60 dark:bg-(--bg-secondary_dark)">
          <FormHeading
            heading="Profile Information"
            className="col-span-full px-0 text-sm md:text-base md:font-semibold"
          />
          <FormRowInputEditable
            label="Name"
            name="name"
            className="capitalize"
            register={register}
            capitalizeValue={true}
          />
          <FormRowInput
            label="Surname"
            name="family_name"
            readOnly={true}
            control={control}
            register={register}
            inputStyles="capitalize"
          />
          <FormRowInputEditable
            label="Location"
            name="location"
            register={register}
            className="capitalize"
            capitalizeValue={true}
          />
          <FormRowInputEditable
            label="Group"
            name="group"
            register={register}
            className="capitalize"
          />
        </section>

        <section className="col-span-full grid grid-cols-1 gap-4 rounded-xl border md:border-none border-gray-200/80 bg-white p-2 shadow-sm md:grid-cols-2 md:gap-6 dark:border-gray-700/60 dark:bg-(--bg-secondary_dark)">
          <FormHeading
            heading="Contact Information"
            className="col-span-full px-0 text-sm md:text-base md:font-semibold"
          />
          <FormRowInput
            label="Email"
            type="email"
            name="email"
            readOnly={true}
            control={control}
            register={register}
          />
          <FormRowInputEditable
            label="Mobile"
            type="text"
            name="mobile"
            register={register}
            error={errors.mobile}
          />
        </section>
      </div>
      <FormActionButtons
        cancelText="Cancel"
        isPending={isPending}
        onCancel={() => navigate("/users")}
        submitText={"Update"}
        className="sticky bottom-0 w-full py-2 backdrop-blur-sm md:static md:w-72 md:py-0"
      />
    </form>
  );
}

export default StoreProfileForm;
