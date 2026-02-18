import { fetchAuthSession } from "aws-amplify/auth";

export const getIdToken = async (): Promise<string> => {
  const session = await fetchAuthSession();

  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) {
    throw new Error("User not authenticated");
  }

  return idToken;
};
