import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormHeading from "../../../customComponents/FormHeading";
import { signIn, confirmSignIn, signOut } from "aws-amplify/auth";

import LoginForm from "./LoginForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { useAuth } from "../../auth/useAuth";
import { getAuthErrorMessage } from "@/utils/getAuthErrorMessage";

import { useUserAttributes } from "../../utils/aws-userAttributes";
import { toast } from "sonner";
import { capitalize } from "@/utils/capitalize";

import type {
  LoginFormValues,
  ChangePasswordFormValues,
} from "../../schemas/index";
import useGlobalContext from "@/context/useGlobalContext";
import { usePOST } from "@/utils/api";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { LockKeyhole } from "lucide-react";

type Step = "LOGIN" | "NEW_PASSWORD";

export default function LoginContainer() {
  const [step, setStep] = useState<Step>("LOGIN");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshAuth, isAuthenticated } = useAuth();
  const { setShowSuccess, setSuccessConfig } = useGlobalContext();
  const { refetch } = useUserAttributes({ enabled: false });

  const { mutateAsync: confirmUserSignup } = usePOST<void, void>({
    resourcePath: "api/admin/confirm-user-signup",
    queryKey: ["users", "status_update"],
  });

  /* -------- LOGIN -------- */
  const handleLogin = async (loginData: LoginFormValues) => {
    setLoading(true);

    try {
      if (isAuthenticated) {
        navigate("/dashboard");
        return;
      }

      await signOut(); // ensure no stale session

      const res = await signIn({
        username: loginData.email,
        password: loginData.password,
      });

      if (
        res.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        setStep("NEW_PASSWORD");
        return;
      }

      const userData = await refetch();
      await refreshAuth();
      if (userData.data?.name) {
        toast.success(`Welcome ${capitalize(userData.data.name)}`);
      }
      navigate("/dashboard");
    } catch (error: unknown) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  /* -------- NEW PASSWORD -------- */
  const handleChangePassword = async (data: ChangePasswordFormValues) => {
    setLoading(true);

    try {
      const res = await confirmSignIn({
        challengeResponse: data.newPassword,
      });

      if (!res.isSignedIn) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      const userData = await refetch();
      // Update user status in DynamoDB
      const response = await confirmUserSignup();
      console.log(response);

      await refreshAuth();

      setSuccessConfig({
        title: "Success",
        message: "Password Successfully Updated!",
      });
      setShowSuccess(true);

      if (userData.data?.name) {
        toast.success(`Welcome ${capitalize(userData.data.name)}`);
      }

      navigate("/dashboard");
    } catch (error: unknown) {
      console.log(getAuthErrorMessage(error));
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === "LOGIN" && (
        <div className="flex flex-col gap-2 md:gap-4">
          <div className="flex justify-center" aria-hidden="true">
            <div className="flex size-20 items-center justify-center rounded-full bg-(--clr-primary)/10 text-(--clr-primary) dark:bg-(--clr-primary)/20">
              <LockKeyhole className="size-10" strokeWidth={1.75} />
            </div>
          </div>
          <FormHeading
            heading="Login to your account"
            className={cn(sharedStyles.headingForm, "text-center md:text-lg")}
            headingStyles="text-center justify-center"
          />
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </div>
      )}

      {step === "NEW_PASSWORD" && (
        <div className="flex flex-col gap-4">
          <FormHeading
            heading="Set New Password"
            className="text-center pb-4 pt-2"
          />
          <ChangePasswordForm
            onSubmit={handleChangePassword}
            loading={loading}
          />
        </div>
      )}
    </>
  );
}
