import { cn } from "@/lib/utils";
import FormHeading from "../../customComponents/FormHeading";
import { sharedStyles } from "@/styles/shared";
import CreateUserForm from "@/components/users/CreateUserForm";

/**
 * This page is for creating a new user. It will be used by the admin to create new users. The form will be the same as the one in the user profile page, but with some differences:
 * - The form will have a dropdown to select the user role (admin, manager, employee)
 * - The form will have a dropdown to select the location (if the user is not an admin)
 * - The form will have a contact information section with fields for email and phone number
 * Path: src/pages/CreateUserPage.tsx
 * Route: /users/create-user
 */

const CreateUserPage = () => {
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <FormHeading
          className={cn(sharedStyles.headingForm)}
          heading="Create User"
        />
        <CreateUserForm />
      </div>
    </div>
  );
};

export default CreateUserPage;
