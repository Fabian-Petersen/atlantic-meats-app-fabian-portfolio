import FormRowInput from "../customComponents/FormRowInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { changePasswordSchema } from "../../schemas/index";

import type { ChangePasswordFormValues } from "../../schemas/index";

const ChangePasswordForm = ({
  onSubmit,
  loading,
}: {
  onSubmit: (data: ChangePasswordFormValues) => void;
  loading: boolean;
}) => {
  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  return (
    <form
      className="flex flex-col gap-8 rounded-lg max-w-xl text-gray-700"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col mt-auto gap-8">
        <FormRowInput
          label="Email"
          type="email"
          name="email"
          control={control}
          placeholder="Enter your email"
          register={register}
          error={errors.email}
        />
        <FormRowInput
          label="Password"
          type="password"
          name="newPassword"
          control={control}
          placeholder="Enter your password"
          register={register}
          error={errors.newPassword}
        />
        <FormRowInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          control={control}
          placeholder="Confirm your password"
          register={register}
          error={errors.confirmPassword}
        />
        <Button
          className="bg-(--clr-primary) text-white leading-2 hover:bg-(--clr-primary)/90 hover:cursor-pointer uppercase tracking-wider py-6"
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
