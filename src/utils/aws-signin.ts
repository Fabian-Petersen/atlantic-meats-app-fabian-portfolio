// $ aws amplify sign in function to the application
import { signIn } from "aws-amplify/auth";

export async function awsCognitoLogin(userName: string, password: string) {
  try {
    // $ Attempt Sign In of User
    const signInResult = await signIn({
      username: userName,
      password: password,
    });
    return signInResult;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
