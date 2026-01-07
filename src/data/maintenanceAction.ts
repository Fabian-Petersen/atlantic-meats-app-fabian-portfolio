export const ROOT_CAUSES = [
  "Wear & Tear",
  "Asset Fatigue",
  "Negligence",
  "Malicious Damage",
  "Installation Fault",
  "Manufacturing Defect",
  "Environmental Factors",
  "Electrical / Power Issue",
  "Operational Error",
  "Unknown",
] as const;

export type ROOT_CAUSES = (typeof ROOT_CAUSES)[number];
