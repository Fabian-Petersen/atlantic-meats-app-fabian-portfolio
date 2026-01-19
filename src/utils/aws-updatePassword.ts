// $ Update a signed in user's password using the updatePassword API.
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
