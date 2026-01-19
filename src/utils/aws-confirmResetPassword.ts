// $ This function handle the api request to reset the password once the user received the confirmation code.
// $ AWS Docs to update user attributes using amplify/auth
// $ https://docs.amplify.aws/gen1/react/build-a-backend/auth/manage-user-profile/

import {
  confirmResetPassword,
  type ConfirmResetPasswordInput,
} from "aws-amplify/auth";

export async function handleConfirmResetPassword({
  username,
  confirmationCode,
  newPassword,
}: ConfirmResetPasswordInput) {
  try {
    await confirmResetPassword({ username, confirmationCode, newPassword });
  } catch (error) {
    console.log(error);
  }
}
