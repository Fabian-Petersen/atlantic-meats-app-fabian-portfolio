// $ aws amplify sign in function to the application
import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { toaster } from "@/components/ui/toaster";
import { useGlobalContext } from "../contexts/useGlobalContext";

// $ 1. Function making the api call to aws cognito
export async function awsCognitoSignOut() {
  try {
    // $ Sign Out Current User
    await signOut();
  } catch (error) {
    console.error("Sign Out Error:", error);
    throw error;
  }
}

// $ 2. Hook with the logic using the function calling the Cognito api, this custom hook can be called inside the components requiring the signout of a user, e.g. the signout button in the header and sidebar.

export const useLogout = () => {
  const context = useGlobalContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { userAttributes } = context;
      await awsCognitoSignOut();
      sessionStorage.removeItem("formData");
      toaster.create({
        type: "info",
        title: "Logging Out..",
        description: `Goodbye ${userAttributes?.name}`,
        duration: 3000,
      });
      ("/");
    } catch (error) {
      console.error("Error signing out:", error);
      navigate("/");
    }
  };
  return handleLogout;
};
