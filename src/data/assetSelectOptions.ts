export const condition: string[] = ["New", "Operational", "Poor", "Broken"];

export const warranty: string[] = ["yes", "no"];
export const impact: string[] = ["production", "safety", "compliance"];

export const location: string[] = [
  "Phillipi",
  "Bellville",
  "Khayelitsha",
  "Wynberg",
  "Maitland",
  "Office",
  "Distribution Centre",
  "Golden Acre",
];

// $ The data options for the "Create Asset Form"
export const CeateAssetFormOptionsData = {
  business_unit: {
    retail: {
      category: {
        processing: [
          "Band Saw",
          "Vacuum Sausage Filler",
          "Piston Sausage Filler",
          "Mixer",
          "Mincer",
          "Slicer",
          "Biltong Maker",
          "V-mag Bins",
        ],
        "Point of Sale": ["Printer", "Barcode Scanner", "POS Display"],
        "Cold Storage": ["Island Refrigerator", "High Back Refrigerator 12ft"],
        handling: ["Scale", "Tray Wrapping Sealer", "Hand Sealer"],
        utilities: ["Gas Stove", "Cooling Fan"],
        appliances: ["Microwave"],
        security: [
          "Alarm Siren",
          "Alarm Control Panel",
          "Digital Video Recorder",
          "Security Camera",
          "Electric Fence",
          "Electric Fence Energiser",
        ],
      },
    },

    distribution: {
      category: {
        handling: ["Forklift", "Pallet Jack"],
        vehicles: ["Truck", "Bakkie"],
        "cold storage": [
          "Cold Room Blower",
          "Freezer Blower",
          "Condenser",
          "Compressor",
        ],
        "dry storage": ["Shelves", "High Beam", "Decking Board", "Upright"],
        workstation: ["Desk", "Laptop", "Monitor", "Printer"],
        appliances: ["Microwave", "Fridge", "Air Conditioning"],
        security: [
          "Alarm Siren",
          "Alarm Control Panel",
          "Digital Video Recorder",
          "Security Camera",
          "Electric Fence",
          "Electric Fence Energiser",
        ],
        "fire fighting": [
          "Hydrant",
          "Extinguisher",
          "Smoke Detector",
          "Hose Reel",
          "Control Panel",
        ],
      },
    },
    "head office": {
      category: {
        workstation: ["Desk", "Laptop", "Monitor"],
        appliances: ["Fridge", "Microwave", "Air conditioning"],
        security: [
          "Alarm System",
          "Alarm Siren",
          "Alarm Control Panel",
          "Digital Video Recorder",
          "Security Camera",
        ],
        "fire fighting": [
          "Hydrant",
          "Extinguisher",
          "Smoke Detector",
          "Hose Reel",
          "Control Panel",
        ],
      },
    },
    maintenance: {
      category: {
        tools: ["Electrical", "Mechanical"],
        workshop: ["Asset 1", "Asset 2"],
      },
    },
  },
} as const;
