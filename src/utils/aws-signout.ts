// $ aws amplify sign in function to the application
import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../auth/AuthContext";
import { useUserAttributes } from "./aws-userAttributes";
import { capitalize } from "@/utils/capitalize";

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
  const { refreshAuth } = useAuth();
  const { data } = useUserAttributes();
  console.log(data);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await awsCognitoSignOut();
      sessionStorage.removeItem("formData");
      toast.success(`Goodbye ${capitalize(data?.name)}`, {
        className: "rounded-xl",
      });
      navigate("/");
      await refreshAuth();
    } catch (error) {
      navigate("/");
    }
  };
  return handleLogout;
};
