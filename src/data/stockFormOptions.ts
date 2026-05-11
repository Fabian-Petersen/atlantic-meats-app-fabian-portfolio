// ─── Static option data ───────────────────────────────────────────────────────

export const CATEGORIES: Record<string, string[]> = {
  Electrical: ["Cables", "Fuses", "Switches", "Lighting"],
  Mechanical: ["Bearings", "Belts", "Seals", "Fasteners"],
  Hydraulic: ["Hoses", "Fittings", "Filters", "Cylinders"],
  Consumables: ["Lubricants", "Cleaning", "PPE", "Stationery"],
};

export const UNITS = ["Each", "Box", "Set", "Litre", "Kg", "Metre", "Roll"];
export const LOCATIONS = [
  "Stores A",
  "Stores B",
  "Workshop",
  "Yard",
  "Office",
].sort();
export const SUPPLIERS = [
  "Supplier A",
  "Supplier B",
  "Supplier C",
  "Supplier D",
];
