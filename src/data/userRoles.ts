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
  "operations manager",
  "regional manager",
  "manager",
  "supervisor",
  "maintenance manager",
  "technician",
  "general worker",
];
