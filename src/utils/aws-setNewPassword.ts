// $ aws amplify sign in function to the application
import { signIn, confirmSignIn } from "aws-amplify/auth";

export async function awsCognitoSetNewPassword(
  userName: string,
  newPassword: string,
) {
  try {
    // $ Attempt Sign In of User
    const signInResult = await signIn({
      username: userName,
      password: newPassword,
    });
    if (
      signInResult.nextStep.signInStep ===
      "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
    ) {
      const confirmSignInResult = await confirmSignIn({
        challengeResponse: newPassword,
      });

      // User is now signed in with their new password
      console.log(
        "Signed in successfully with new password",
        confirmSignInResult,
      );
      return confirmSignInResult;
    }
    return signInResult;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
