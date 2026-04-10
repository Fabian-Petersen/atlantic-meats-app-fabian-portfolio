import FormHeading from "../../customComponents/FormHeading";
// import FormActionButtons from "@/components/features/FormActionButtons";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { ErrorPage } from "@/components/features/Error";
import useGlobalContext from "@/context/useGlobalContext";
import type { UsersAPIResponse } from "@/schemas";
import { useById } from "@/utils/api";
import StoreProfileForm from "@/components/users/StoreProfileForm";
// import { useNavigate } from "react-router-dom";

function StoreProfilePage() {
  const { showUserProfileDialog, selectedRowId } = useGlobalContext();

  const {
    data: user,
    isPending,
    isError,
  } = useById<UsersAPIResponse>({
    id: selectedRowId ?? "",
    queryKey: ["userRequests", "user"],
    resourcePath: "users",
  });

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  // fallback UI if timeout reached
  if (!user) {
    return (
      <ErrorPage
        title="Error loading user information!!"
        message="Please check your connection and try again."
      />
    );
  }

  if (isPending) return <PageLoadingSpinner />;
  if (isError)
    return <ErrorPage title="" message="User data could not be retrieved" />;

  if (showUserProfileDialog) return null;
  return (
    <div className="flex items-center justify-center w-full h-full p-4 dark:bg-bgdark bg-gray-100">
      <div className="bg-white flex flex-col gap-4 w-full lg:max-w-3xl h-auto rounded-xl shadow-lg p-4 dark:bg-[#1d2739] dark:text-gray-100 dark:border-gray-700/50 dark:border capitalize">
        <FormHeading heading="Store Account Profile" />
        <StoreProfileForm user={user ?? null} />
      </div>
    </div>
  );
}

export default StoreProfilePage;
