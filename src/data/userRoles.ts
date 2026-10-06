import type { UserGroup, UserPosition } from "@/schemas/usersSchema";

export const userRoles: UserGroup[] = [
  "admin",
  "contractor",
  "maintenance",
  "manager",
  "user",
];

export const division: string[] = [
  "retail",
  "central servives",
  "distribution",
  "maintenance",
];

export const userPosition: UserPosition[] = [
  "operations manager",
  "regional manager",
  "branch manager",
  "supervisor",
  "maintenance manager",
  "technician",
  "general worker",
];
