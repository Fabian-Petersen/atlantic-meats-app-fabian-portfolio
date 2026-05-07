import FormHeading from "../../customComponents/FormHeading";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { Error } from "@/components/features/Error";
import useGlobalContext from "@/context/useGlobalContext";
import type { UsersAPIResponse } from "@/schemas";
import { useById } from "@/utils/api";
import StoreProfileForm from "@/components/users/StoreProfileForm";
import { stores } from "@/data/stores";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

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
    return <Error />;
  }

  if (isPending) return <PageLoadingSpinner />;
  if (isError) return <Error />;

  const username = user?.name;
  /**
   * Check id the user is a store or a person by comparing the username to the list of stores.
   */
  const isStoreUser: boolean = stores.some(
    (store) => store.toLowerCase() === username.toLowerCase(),
  );

  if (showUserProfileDialog) return null;
  return (
    // <div className="flex items-center justify-center w-full h-full p-4 dark:bg-bgdark bg-gray-100">
    //   <div className="bg-white flex flex-col gap-4 w-full lg:max-w-3xl h-auto rounded-xl shadow-lg p-4 dark:bg-[#1d2739] dark:text-gray-100 dark:border-gray-700/50 dark:border capitalize">
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent, "gap-2")}>
        <FormHeading
          heading={
            isStoreUser ? "Store Account Profile" : "User Account Profile"
          }
          className={sharedStyles.headingForm}
        />
        <StoreProfileForm user={user ?? null} />
      </div>
    </div>
  );
}

export default StoreProfilePage;
