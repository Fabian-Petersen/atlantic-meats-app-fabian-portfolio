import type { UserGroup, UserPosition } from "@/schemas/usersSchema";

export const userRoles: UserGroup[] = [
  "manager",
  "admin",
  "user",
  "contractor",
];

export const division: string[] = [
  "retail",
  "central servives",
  "distribution",
  "maintenance",
];

export const userPosition: UserPosition[] = [
  "operation's manager",
  "regional manager",
  "branch manager",
  "branch supervisor",
  "maintenance manager",
  "technician",
  "general worker",
];
