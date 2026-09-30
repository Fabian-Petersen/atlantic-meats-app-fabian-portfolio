import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft, KeyRound } from "lucide-react";

import FormHeading from "../../../customComponents/FormHeading";
import FormRowInput from "../../../customComponents/FormRowInput";
import { usePasswordVisibility } from "@/utils/usePasswordVisibility";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const resetConfirmationSchema = z
  .object({
    code: z
      .string()
      .length(6, "Verification code must be 6 digits")
      .regex(/^\d+$/, "Verification code must contain only numbers"),
    newPassword: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/\d/, "Password must contain a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetConfirmationValues = z.infer<typeof resetConfirmationSchema>;

type Props = {
  email: string;
  isLoading: boolean;
  onBack: () => void;
  onResend: () => Promise<void>;
  onSubmit: (code: string, newPassword: string) => Promise<void>;
};

const ConfirmForgotPassword = ({
  email,
  isLoading,
  onBack,
  onResend,
  onSubmit,
}: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetConfirmationValues>({
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetConfirmationSchema),
  });
  const { isVisible, type, toggle } = usePasswordVisibility();
  const submitting = isSubmitting || isLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-bgdark">
      <div className="relative flex w-full max-w-md flex-col gap-6 rounded-xl border border-gray-100 bg-white p-6 pt-16 shadow-md dark:border-border-dark/20 dark:bg-(--bg-primary_dark) sm:p-8 sm:pt-16">
        <button
          aria-label="Return to email entry"
          type="button"
          className="absolute left-4 top-4 flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-gray-500 transition-colors hover:cursor-pointer hover:bg-gray-100 hover:text-(--clr-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--clr-primary) dark:text-(--clr-textDark) dark:hover:bg-white/10 sm:left-6 sm:top-6"
          onClick={onBack}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span>Change email</span>
        </button>

        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="flex size-20 items-center justify-center rounded-full bg-(--clr-primary)/10 text-(--clr-primary) dark:bg-(--clr-primary)/20"
            aria-hidden="true"
          >
            <KeyRound className="size-10" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <FormHeading
              heading="Reset Password"
              className="p-0 text-gray-800 dark:text-gray-100"
              headingStyles="justify-center text-center"
            />
            <p className="text-xs text-gray-500 dark:text-(--clr-textDark)">
              Enter the code sent to <span className="font-medium">{email}</span>
              , then choose a new password.
            </p>
          </div>
        </div>

        <form
          className="flex flex-col gap-6 text-gray-700"
          onSubmit={handleSubmit((values) =>
            onSubmit(values.code, values.newPassword),
          )}
        >
          <FormRowInput
            label="Verification Code"
            name="code"
            type="text"
            placeholder="Enter the 6-digit code"
            autoComplete="one-time-code"
            register={register}
            error={errors.code}
            control={control}
          />
          <FormRowInput
            label="New Password"
            name="newPassword"
            placeholder="Enter your new password"
            autoComplete="new-password"
            type={type("newPassword")}
            togglePassword={() => toggle("newPassword")}
            isVisible={isVisible("newPassword")}
            register={register}
            error={errors.newPassword}
            control={control}
          />
          <FormRowInput
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your new password"
            autoComplete="new-password"
            type={type("confirmPassword")}
            togglePassword={() => toggle("confirmPassword")}
            isVisible={isVisible("confirmPassword")}
            register={register}
            error={errors.confirmPassword}
            control={control}
          />

          <button
            type="button"
            className="self-end text-xs text-blue-500 hover:cursor-pointer hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onResend}
            disabled={submitting}
          >
            Resend code
          </button>

          <Button
            className="w-full bg-(--clr-primary) py-6 text-sm font-medium uppercase tracking-wider text-white hover:cursor-pointer hover:bg-(--clr-primary)/90"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="size-8" />
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmForgotPassword;
