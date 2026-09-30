// $ aws amplify forgot password function for the application

import { useState } from "react";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
type Step = "REQUEST" | "CONFIRM" | "DONE";

export function useForgotPassword() {
  const [step, setStep] = useState<Step>("REQUEST");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Send reset code
  const sendResetCode = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const output = await resetPassword({ username: email });

      if (
        output.nextStep.resetPasswordStep ===
        "CONFIRM_RESET_PASSWORD_WITH_CODE"
      ) {
        setStep("CONFIRM");
      } else {
        setStep("DONE");
      }

      return output;
    } catch (err) {
      setError("Failed to send reset code");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Confirm new password
  const confirmNewPassword = async (
    email: string,
    code: string,
    newPassword: string,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      setStep("DONE");
    } catch (err) {
      setError("Failed to reset password");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    isLoading,
    error,
    sendResetCode,
    confirmNewPassword,
    restart: () => {
      setError(null);
      setStep("REQUEST");
    },
  };
}
