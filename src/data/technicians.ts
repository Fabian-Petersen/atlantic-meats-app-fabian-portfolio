export type TechnicianOption = {
  label: string;
  value: string;
  name: string;
  sub: string;
};

export type ContractorOption = {
  label: string;
  value: string;
  name: string;
  sub: string;
};

export type AssignToGroup = "technician" | "contractor" | "other";

export const assignToGroup: AssignToGroup[] = [
  "technician",
  "contractor",
  "other",
];

export const technicians: TechnicianOption[] = [
  {
    label: "Leon Matalay",
    value: "31dcb2e8-f071-700e-ca1f-0830511026b9",
    name: "Leon Matalay",
    sub: "31dcb2e8-f071-700e-ca1f-0830511026b9",
  },
  {
    label: "John Smith",
    value: "6a3c9e21-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    name: "John Smith",
    sub: "6a3c9e21-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  },
];

export const contractor: ContractorOption[] = [
  {
    label: "CBM Refrigeration",
    value: "31dcb2e8-f071-700e-ca1f-0830511026b9",
    name: "CBM Refrigeration",
    sub: "31dcb2e8-f071-700e-ca1f-0830511026b9",
  },
  {
    label: "Joey's Electrical",
    value: "31dcb2e8-f071-700e-ca1f-0830511026b9",
    name: "Joey's Electrical",
    sub: "31dcb2e8-f071-700e-ca1f-0830511026b9",
  },
];
