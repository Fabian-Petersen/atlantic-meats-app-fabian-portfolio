// $ Get the user groups from cognito

import { fetchAuthSession } from "aws-amplify/auth";
import type { UserGroup } from "@/schemas/usersSchema";

const validGroups: UserGroup[] = ["admin", "technician", "manager", "user"];

export async function getUserGroups(): Promise<UserGroup[]> {
  const session = await fetchAuthSession();
  const claim = session.tokens?.accessToken?.payload["cognito:groups"];

  if (!Array.isArray(claim)) return [];

  return claim.filter(
    (item): item is UserGroup =>
      typeof item === "string" && validGroups.includes(item as UserGroup),
  );
}
