import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormHeading from "../customComponents/FormHeading";
import { signIn, confirmSignIn, signOut } from "aws-amplify/auth";

import LoginForm from "./LoginForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { useAuth } from "../../auth/AuthContext";

import { useUserAttributes } from "../../utils/aws-userAttributes";
import { toast } from "sonner";
import { capitalize } from "@/utils/capitalize";

// $ Types
import type {
  LoginFormValues,
  ChangePasswordFormValues,
} from "../../schemas/index";

type Step = "LOGIN" | "NEW_PASSWORD";

export default function LoginContainer() {
  const [step, setStep] = useState<Step>("LOGIN");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshAuth, isAuthenticated } = useAuth();

  // $ Hook to request the user data from Cognito

  /* -------- LOGIN -------- */
  const { refetch } = useUserAttributes();

  const handleLogin = async (loginData: LoginFormValues) => {
    setLoading(true);
    if (isAuthenticated) {
      navigate("/dashboard");
    }

    try {
      await signOut(); // ensure no user is logged in
      const res = await signIn({
        username: loginData.email,
        password: loginData.password,
      });
      await refreshAuth();

      const userData = await refetch(); // wait for latest attributes
      if (userData.data?.name) {
        toast.success(`Welcome ${capitalize(userData.data.name)}`);
      }

      navigate("/dashboard");

      if (
        res.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        setStep("NEW_PASSWORD");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  /* ----- NEW PASSWORD ----- */
  const handleChangePassword = async (data: ChangePasswordFormValues) => {
    setLoading(true);

    try {
      await confirmSignIn({
        challengeResponse: data.newPassword,
      });
      await signOut(); // clears the auto-login session
      navigate("/login");

      setStep("LOGIN");
      alert("Password updated. Please sign in.");
    } finally {
      navigate("/dashboard");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-100 bg-white h-auto rounded-xl shadow-lg p-4 dark:border-gray-700/50 dark:bg-[#1d2739]">
      {step === "LOGIN" && (
        <div>
          <FormHeading heading="Sign In" className="text-center pb-8 pt-2" />
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </div>
      )}

      {step === "NEW_PASSWORD" && (
        <div>
          <FormHeading heading="Set New Password" className="text-center" />
          <ChangePasswordForm
            onSubmit={handleChangePassword}
            loading={loading}
          />
        </div>
      )}
      <div className="mt-6 text-center">
        <a
          href="/forgotPassword"
          className="text-blue-400 hover:text-blue-500 text-sm mt-auto"
        >
          Forgot Password
        </a>
      </div>
    </div>
  );
}
