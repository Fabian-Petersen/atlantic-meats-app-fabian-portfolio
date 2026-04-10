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

type Step = "LOGIN" | "NEW_PASSWORD";

export default function LoginContainer() {
  const [step, setStep] = useState<Step>("LOGIN");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshAuth, isAuthenticated } = useAuth();
  const { setShowSuccess, setSuccessConfig } = useGlobalContext();
  const { refetch } = useUserAttributes();

  const { mutateAsync: confirmUserSignup } = usePOST<void, void>({
    resourcePath: "admin/confirm_user_signup",
    queryKey: ["userRequests", "status_update"],
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

      await refreshAuth();
      const userData = await refetch();
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

      await refreshAuth();
      const userData = await refetch();
      // Update user status in DynamoDB
      const response = await confirmUserSignup();
      console.log(response);

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
    <div className="flex flex-col gap-8 w-full max-w-[360px] bg-white rounded-xl shadow-lg p-6 border border-white dark:border-border-dark/20 dark:bg-(--bg-primary_dark)">
      {step === "LOGIN" && (
        <div className="flex flex-col gap-4">
          <FormHeading
            heading="Login to your Account"
            className="text-center pb-4 pt-2"
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
    </div>
  );
}

// $ Types
// import type {
//   LoginFormValues,
//   ChangePasswordFormValues,
// } from "../../schemas/index";
// import useGlobalContext from "@/context/useGlobalContext";

// type Step = "LOGIN" | "NEW_PASSWORD";

// export default function LoginContainer() {
//   const [step, setStep] = useState<Step>("LOGIN");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { refreshAuth, isAuthenticated } = useAuth();
//   const { setShowSuccess, setSuccessConfig } = useGlobalContext();

//   // $ Hook to request the user data from Cognito

//   /* -------- LOGIN -------- */
//   const { refetch } = useUserAttributes();

//   const handleLogin = async (loginData: LoginFormValues) => {
//     setLoading(true);

//     try {
//       if (isAuthenticated) {
//         navigate("/dashboard");
//         return;
//       }

//       await signOut(); // ensure no user is logged in

//       const res = await signIn({
//         username: loginData.email,
//         password: loginData.password,
//       });

//       await refreshAuth();

//       const userData = await refetch(); // wait for latest attributes
//       if (userData.data?.name) {
//         toast.success(`Welcome ${capitalize(userData.data.name)}`);
//       }

//       if (
//         res.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
//       ) {
//         setStep("NEW_PASSWORD");
//         return;
//       }
//       navigate("/dashboard");
//     } catch (error: unknown) {
//       toast.error(getAuthErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ----- NEW PASSWORD ----- */
//   const handleChangePassword = async (data: ChangePasswordFormValues) => {
//     setLoading(true);

//     try {
//       await confirmSignIn({
//         challengeResponse: data.newPassword,
//       });
//       await signOut(); // clears the auto-login session
//       navigate("/login");

//       setStep("LOGIN");
//       setSuccessConfig({
//         title: "Success",
//         message: "Password Successfully Updated!!",
//       });
//       setShowSuccess(true);
//     } finally {
//       navigate("/dashboard");
//       setLoading(false);
//     }
//   };

// }
