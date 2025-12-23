import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormHeading from "../customComponents/FormHeading";
import { signIn, confirmSignIn, signOut } from "aws-amplify/auth";

import LoginForm from "./LoginForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { useAuth } from "../../auth/AuthContext";

// $ Types
import type {
  LoginFormValues,
  ChangePasswordFormValues,
} from "../../schemas/index";

type Step = "LOGIN" | "NEW_PASSWORD";

export default function LoginContainer() {
  const [step, setStep] = useState<Step>("LOGIN");
  // const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  /* -------- LOGIN -------- */
  const handleLogin = async (data: LoginFormValues) => {
    setLoading(true);

    try {
      await signOut(); // ensure no user is logged in
      const res = await signIn({
        username: data.email,
        password: data.password,
      });
      await refreshAuth();
      navigate("/dashboard");
      // console.log("Login response:", res);
      if (
        res.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        // setUser(res);
        setStep("NEW_PASSWORD");
        return;
      }

      // console.log("Authenticated");
    } finally {
      setLoading(false);
    }
  };

  /* ----- NEW PASSWORD ----- */
  const handleChangePassword = async (data: ChangePasswordFormValues) => {
    setLoading(true);
    // console.log("Changing password to:", data.newPassword);
    try {
      await confirmSignIn({
        challengeResponse: data.newPassword,
      });
      await signOut(); // clears the auto-login session
      navigate("/login");

      // setUser(null);
      setStep("LOGIN");
      alert("Password updated. Please sign in.");
    } finally {
      navigate("/dashboard");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-100 bg-white h-auto rounded-xl shadow-lg p-4">
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
