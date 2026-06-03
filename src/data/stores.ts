export const stores: string[] = [
  "Phillipi",
  "Bellville",
  "Khayelitsha",
  "Wynberg",
  "Maitland",
  "Golden Acre",
];

export const allLocations: string[] = [
  "Phillipi",
  "Bellville",
  "Khayelitsha",
  "Wynberg",
  "Maitland",
  "Golden Acre",
  "Central Services",
  "Distribution Centre",
];

// export const locations = {
//   Phillipi: "PHP",
//   Bellville: "BTX",
//   Khayelitsha: "IKH",
//   Wynberg: "WBG",
//   Maitland: "VTR",
//   "Golden Acre": "GAC",
//   "Distribution Centre": "DCN",
// };

export const locations = {
  phillipi: {
    code: "PHP",
    area: "phillipi",
    address:
      "Shop 1 Junction Mall, 149 Govan Mbeki Rd, Philippi, Cape Town, 7750",
    position: {
      longitude: "-34.001215487937536",
      latitude: "18.59174489802823",
    },
    landline: "0213720065",
  },
  bellville: {
    code: "BTX",
    area: "bellville",
    address: "20 Charl Malan St, Unclear, Cape Town, 7530",
    position: {
      longitude: "-33.90537673722487",
      latitude: "18.629428576756258",
    },
    landline: "0219494243",
  },
  khayelitsha: {
    code: "IKH",
    area: "khayelitsha",
    address:
      "Shop F04, Ilitha Mall, 17 Khwezi Cres, Litha Park, Cape Town, 7784",
    position: {
      longitude: "-34.04907921392364",
      latitude: "18.6706643321264",
    },
    landline: "0210300167",
  },
  wynberg: {
    code: "WBG",
    area: "wynberg",
    address: "26 Station Rd, Wynberg, Cape Town, 7800",
    position: {
      longitude: "-34.00514896083619",
      latitude: "18.47061344770795",
    },
    landline: "0217615767",
  },
  maitland: {
    code: "VTR",
    area: "maitland",
    address: "287 Voortrekker Rd, Maitland, Cape Town, 7404",
    position: {
      longitude: "-33.92196391122811",
      latitude: "18.491258977067456",
    },
    landline: "",
  },
  distribution: {
    code: "DCN",
    area: "maitland",
    address: "12B Chatham St, Maitland, Cape Town, 7404",
    position: {
      longitude: "-33.92255685007822",
      latitude: "18.49629623260718",
    },
    landline: "",
  },
  "golden acre": {
    code: "GAC",
    area: "cape town",
    address:
      "Shop S41A, Shopping Centre, Golden Acre, 9 Adderley, Strand St, Foreshore, Cape Town, 8001",
    position: {
      longitude: "",
      latitude: "",
    },
    landline: "",
  },
};
