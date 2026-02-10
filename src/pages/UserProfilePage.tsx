import FormHeading from "../../customComponents/FormHeading";
import { useUserAttributes } from "@/utils/aws-userAttributes";
import UserProfileForm from "@/components/userProfile/UserProfileForm";
// import FormActionButtons from "@/components/features/FormActionButtons";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { ErrorPage } from "@/components/features/Error";
import useGlobalContext from "@/context/useGlobalContext";
// import { useNavigate } from "react-router-dom";

function UserProfilePage() {
  const { data: user, isLoading, isError } = useUserAttributes();
  // const navigate = useNavigate();
  const { showUserProfileDialog } = useGlobalContext();

  if (isLoading) return <PageLoadingSpinner />;
  if (isError)
    return <ErrorPage title="" message="User data could not be retrieved" />;

  if (showUserProfileDialog) return null;
  return (
    <div className="flex items-center justify-center w-full h-full p-4 dark:bg-bgdark bg-gray-100">
      <div className="bg-white flex flex-col gap-4 w-full lg:max-w-3xl h-auto rounded-xl shadow-lg p-4 dark:bg-[#1d2739] dark:text-gray-100 dark:border-gray-700/50 dark:border capitalize">
        <FormHeading heading="Account Management" />
        <UserProfileForm user={user ?? null} />
        {/* <FormActionButtons
          handleCancel={() => navigate("/dashboard")}
          redirectText="Back"
          actionText="Edit"
          // action={() => setShowUserProfileDialog(true)}
        /> */}
      </div>
    </div>
  );
}

export default UserProfilePage;
