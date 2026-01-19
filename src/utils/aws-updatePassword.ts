// $ Update a signed in user's password using the updatePassword API.
// $ AWS Docs to update user attributes using amplify/auth
// $ https://docs.amplify.aws/gen1/react/build-a-backend/auth/manage-user-profile/

import { updatePassword, type UpdatePasswordInput } from "aws-amplify/auth";

export async function handleUpdatePassword({
  oldPassword,
  newPassword,
}: UpdatePasswordInput) {
  try {
    await updatePassword({ oldPassword, newPassword });
  } catch (err) {
    console.log(err);
  }
}
