import FormHeading from "../../../customComponents/FormHeading";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { Error } from "@/components/features/Error";
import { useModalState } from "@/context/useModalState";
import type { UsersAPIResponse } from "@/schemas";
import { useById } from "@/utils/api";
import UserAccountProfileForm from "@/components/users/UserAccountProfileForm";
import { stores } from "@/data/stores";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";

function UserAccountProfilePage() {
  const { showUserProfileDialog } = useModalState();
  const { id } = useParams<{ id: string }>();

  const {
    data: user,
    isPending,
    isError,
  } = useById<UsersAPIResponse>({
    id: id ?? "",
    queryKey: ["users", "detail"],
    resourcePath: "api/users",
  });

  if (!id || isError) {
    return <Error />;
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  // fallback UI if timeout reached
  if (!user) {
    return <Error />;
  }

  const username = user?.name;
  /**
   * Check id the user is a store or a person by comparing the username to the list of stores.
   */
  const isStoreUser: boolean = stores.some(
    (store) => store.toLowerCase() === username.toLowerCase(),
  );

  if (showUserProfileDialog) return null;
  return (
    <div
      className={cn(
        sharedStyles.pageContainer,
        "min-h-[calc(100vh-var(--sm-navbarHeight))] items-start bg-(--pageLight) p-2 md:min-h-[calc(100vh-var(--lg-navbarHeight))] md:items-center dark:bg-(--pageDark)",
      )}
    >
      <div
        className={cn(
          sharedStyles.pageContent,
          "gap-3 p-0 shadow-none md:p-6 dark:bg-(--pageDark) md:dark:bg-(--bg-secondary_dark)",
        )}
      >
        <FormHeading
          heading={
            isStoreUser ? "Store Account Profile" : "User Account Profile"
          }
          className={cn(sharedStyles.headingForm, "px-1")}
          redirect={true}
          redirectTo="/users"
        />
        <UserAccountProfileForm user={user ?? null} />
      </div>
    </div>
  );
}

export default UserAccountProfilePage;
