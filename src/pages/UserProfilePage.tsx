import FormHeading from "../../customComponents/FormHeading";
import UserProfileForm from "@/components/users/UserProfileForm";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { Error } from "@/components/features/Error";
import useGlobalContext from "@/context/useGlobalContext";
import { useGetUser } from "@/utils/getUser";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

function UserProfilePage() {
  const { data: user, isPending, isError } = useGetUser();
  const { showUserProfileDialog } = useGlobalContext();

  // console.log("user:", user);

  if (isPending) return <PageLoadingSpinner />;
  if (isError) return <Error />;

  if (showUserProfileDialog) return null;
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent, "gap-2")}>
        <FormHeading
          heading="User Account Profile"
          className={sharedStyles.headingForm}
        />
        <UserProfileForm user={user ?? null} />
      </div>
    </div>
  );
}

export default UserProfilePage;
