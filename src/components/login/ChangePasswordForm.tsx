import FormRowInput from "../../../customComponents/FormRowInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { changePasswordSchema } from "../../schemas/index";

import type { ChangePasswordFormValues } from "../../schemas/index";
import { Spinner } from "../ui/spinner";
import { usePasswordVisibility } from "@/utils/usePasswordVisibility";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

const ChangePasswordForm = ({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (data: ChangePasswordFormValues) => void;
  onCancel: () => void;
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

  // $ Manange the Password Visibility
  const { isVisible, type, toggle } = usePasswordVisibility();

  return (
    <form
      className="flex h-full max-w-xl flex-col gap-6 rounded-lg text-gray-700"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-6">
        <FormRowInput
          label="Email"
          type="email"
          name="email"
          // control={control}
          placeholder="Enter your email"
          autoComplete="username"
          register={register}
          error={errors.email}
          control={control}
        />
        <FormRowInput
          label="Password"
          name="newPassword"
          placeholder="Enter your password"
          autoComplete="new-password"
          type={type("newPassword")} // comes from the usePasswordVisibility hook
          togglePassword={() => toggle("newPassword")} // comes from the usePasswordVisibility hook
          isVisible={isVisible("newPassword")} // comes from the usePasswordVisibility hook
          register={register}
          error={errors.newPassword}
          control={control}
        />
        <FormRowInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          autoComplete="new-password"
          type={type("confirmPassword")} // comes from the usePasswordVisibility hook
          togglePassword={() => toggle("confirmPassword")} // comes from the usePasswordVisibility hook
          isVisible={isVisible("confirmPassword")} // comes from the usePasswordVisibility hook
          register={register}
          error={errors.confirmPassword}
          control={control}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Button
          className={`${
            loading
              ? "bg-yellow-400 text-black"
              : "bg-(--clr-primary) text-white"
          } leading-2 py-6 uppercase tracking-wider hover:cursor-pointer hover:bg-(--clr-primary)/90`}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="flex gap-4 items-center">
              <Spinner data-icon="inline-start" className="size-8" />
              <span className="text-xs lg:text-sm">updating password...</span>
            </div>
          ) : (
            "Update Password"
          )}
        </Button>
        <Button
          className={cn(
            sharedStyles.btn,
            sharedStyles.btnCancel,
            "py-3.5 uppercase tracking-wider text-sm",
          )}
          type="button"
          variant="cancel"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
