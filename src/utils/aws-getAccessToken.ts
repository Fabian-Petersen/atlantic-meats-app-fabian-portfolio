import { fetchAuthSession } from "aws-amplify/auth";

export const getAccessToken = async (): Promise<string> => {
  const session = await fetchAuthSession();

  const accessToken = session.tokens?.accessToken?.toString();
  if (!accessToken) {
    throw new Error("User not authenticated");
  }

  return accessToken;
};
