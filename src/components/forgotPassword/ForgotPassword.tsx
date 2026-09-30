// $ React Hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// $ React-Hook-Form, zod schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// $ Hooks
import { useForgotPassword } from "@/utils/aws-forgotPassword";

// $ Import schemas
import {
  forgotPasswordSchema,
  type ForgotFormValues,
} from "../../schemas/index";

// $ Components
import FormHeading from "../../../customComponents/FormHeading";
import FormRowInput from "../../../customComponents/FormRowInput";
import { Button } from "../ui/button";
import { ChevronLeft, KeyRound } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/utils/getAuthErrorMessage";
import ConfirmForgotPassword from "./ConfirmForgotPassword";

const ForgotPassword = () => {
  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const {
    step,
    isLoading,
    sendResetCode,
    confirmNewPassword,
    restart,
  } = useForgotPassword();

  const onSubmit = async (data: ForgotFormValues) => {
    try {
      setEmail(data.email);
      await sendResetCode(data.email);
      toast.success("A password reset code has been sent to your email.");
    } catch (error: unknown) {
      toast.error(getAuthErrorMessage(error));
    }
  };

  const handleConfirm = async (code: string, newPassword: string) => {
    try {
      await confirmNewPassword(email, code, newPassword);
      toast.success("Your password has been reset. You can now sign in.");
      navigate("/");
    } catch (error: unknown) {
      toast.error(getAuthErrorMessage(error));
    }
  };

  const handleResend = async () => {
    try {
      await sendResetCode(email);
      toast.success("A new password reset code has been sent.");
    } catch (error: unknown) {
      toast.error(getAuthErrorMessage(error));
    }
  };

  if (step === "CONFIRM") {
    return (
      <ConfirmForgotPassword
        email={email}
        isLoading={isLoading}
        onBack={restart}
        onResend={handleResend}
        onSubmit={handleConfirm}
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-bgdark px-4">
      <div className="relative flex min-h-80 w-full max-w-md flex-col gap-8 rounded-xl border border-gray-100 bg-white p-6 pt-16 shadow-md dark:border-border-dark/20 dark:bg-(--bg-primary_dark) sm:p-8 sm:pt-16">
        <button
          aria-label="Return to login"
          type="button"
          className="absolute left-4 top-4 flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-gray-500 transition-colors duration-150 hover:cursor-pointer hover:bg-gray-100 hover:text-(--clr-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--clr-primary) dark:text-(--clr-textDark) dark:hover:bg-white/10 sm:left-6 sm:top-6"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span>Back to login</span>
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="flex size-24 items-center justify-center rounded-full bg-(--clr-primary)/10 text-(--clr-primary) dark:bg-(--clr-primary)/20"
            aria-hidden="true"
          >
            <KeyRound className="size-12" strokeWidth={1.3} />
          </div>
          <div className="flex flex-col justify-center items-center gap-1.5">
            <FormHeading
              heading="Forgot Password"
              className="text-gray-800 dark:text-gray-100 p-0"
              headingStyles="justify-center text-center"
              redirect={false}
            />
            <p className="text-xs text-gray-500 dark:text-(--clr-textDark)">
              Enter your registered email and we'll send you a reset code.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between gap-6"
        >
          <FormRowInput
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            autoComplete="username"
            register={register}
            error={errors.email}
            control={control}
          />

          <Button
            className={`
          w-full py-3 md:py-6 uppercase tracking-wider text-sm font-medium
          transition-colors duration-150 hover:cursor-pointer
          ${
            isSubmitting || isLoading
              ? "bg-yellow-400 text-black"
              : "bg-(--clr-primary) hover:bg-(--clr-primary)/90 text-white"
          }
        `}
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <Spinner className="w-8 h-8 mx-auto" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
