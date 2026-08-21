import * as z from "zod";
import { metricValuesSchema } from "@/schemas/metricSchemas";

// ============================================================================
// Asset Request
// ============================================================================

// $ Schema to create a new asset
export const assetRequestSchema = z.object({
  business_unit: z.string().min(1, { message: "Business unit required" }),
  area: z.string().min(1, { message: "Area is required" }),
  equipment: z.string().min(1, { message: "Please select a equipment" }),
  assetID: z.string().min(1, {
    message: "Please enter asset id",
  }),
  condition: z.string().min(1, { message: "Please select condition" }),
  location: z.string().min(1, { message: "Please select a location" }),
  serialNumber: z.string().optional(),
  additional_notes: z.string().optional(),

  // NEW uploads only
  images: z.array(z.instanceof(File)).default([]),
});

export type AssetRequestFormValues = z.infer<typeof assetRequestSchema>;

// ============================================================================
// Presigned URLs
// ============================================================================

// $ Schema for the PresignedURL's
export const presignedURLSchema = z.object({
  bucket: z.string(),
  filename: z.string(),
  url: z.string(),
  key: z.string(),
  content_type: z.string(),
});

// ============================================================================
// Asset API Response
// ============================================================================

// $ Schema for the API Response from the database when fetching
// the assets with image urls
export const assetApiResponseSchema = assetRequestSchema
  .omit({ images: true })
  .extend({
    id: z.string(),
    createdAt: z.string(),
    images: z.array(presignedURLSchema).default([]),
  })
  .extend({
    // Asset verification fields
    verified_by: z.string(),
    last_verified_at: z.string(),
    next_verification_due: z.string(),

    verified_location: z.object({
      longitude: z.number(),
      latitude: z.number(),
    }),

    verify_status: z.enum(["verified", "overdue", "due soon", "not found"]),
  });

export type AssetAPIResponse = z.infer<typeof assetApiResponseSchema>;

// ============================================================================
// Create Asset Payload
// ============================================================================

// $ Type for sending the asset images to the backend excluding the images.
// The images are not included with the initial request.
export type CreateAssetPayload = Omit<AssetRequestFormValues, "images"> & {
  images: {
    filename: string;
    content_type: string;
  }[];
};

// ============================================================================
// Asset History
// ============================================================================

export const assetHistoryItemSchema = z.object({
  // From requests table
  id: z.string(),
  jobCreated: z.string().nullable(),
  description: z.string().nullable(),
  equipment: z.string().nullable(),

  // From actions table
  location: z.string(),
  assetID: z.string(),
  jobcardNumber: z.string().nullable(),
  sundries: z.array(z.unknown()).nullable(),
  total_cost_sundries: z.number().nullable(),
  parts: z.array(z.unknown()).nullable(),
  total_cost_parts: z.number().nullable(),
  contractor: z.string().nullable(),
  total_cost_contractor: z.number().nullable(),
  actioned_by: z.string().nullable(),
  completed_at: z.string().nullable(),
});

export const reliabilitySchema = z.array(
  z.object({
    name: z.enum(["MTBF", "MTTR", "Availability", "Failure Count"]),
    value: z.number(),
  }),
);

export type Reliability = z.infer<typeof reliabilitySchema>[number];

export type AssetHistoryItem = z.infer<typeof assetHistoryItemSchema>;

export const assetHistoryResponseSchema = z.object({
  assetID: z.string(),
  last_completed_job: z.string(),

  metrics: {
    completedRequests: metricValuesSchema,
    inProgressRequests: metricValuesSchema,
    pendingRequests: metricValuesSchema,
    total_cost: metricValuesSchema,
  },

  reliability: reliabilitySchema,

  history: z.array(assetHistoryItemSchema),

  total_cost_by_month: z.record(
    z.string(),
    z.array(
      z.object({
        name: z.string(),
        value: z.number(),
      }),
    ),
  ),
});

// ============================================================================
// Asset Verification
// ============================================================================

// $ Schema for the Asset Verification request to backend
export const assetVerificationSchema = z.object({
  assetID: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

// $ Schema for the Asset Verification History API response
export const assetVerificationHistorySchema = z.object({
  id: z.string(),
  assetID: z.string(),
  verified_by: z.string(),
  last_verified_at: z.string(),
  next_verification_due: z.string(),

  verified_location: z.object({
    longitude: z.number(),
    latitude: z.number(),
  }),

  verify_status: z.enum([
    "verified",
    "overdue",
    "due soon",
    "not found",
    "pending",
  ]),
});

// ============================================================================
// Asset Table
// ============================================================================

// $ Schema for the Asset Table Menu
export const assetTableRowSchema = assetRequestSchema
  .omit({
    business_unit: true,
    images: true,
  })
  .extend({
    id: z.string(),
    createdAt: z.string(),
  });

// ============================================================================
// Asset Verification Response
// ============================================================================

export const assetVerificationResponseSchema = z.object({
  message: z.string(),
});

export type AssetAPIVerificationHistory = z.infer<
  typeof assetVerificationHistorySchema
>;

export type VerifyAssetRequest = z.infer<typeof assetVerificationSchema>;

export type VerifyAssetResponse = z.infer<
  typeof assetVerificationResponseSchema
>;

export type AssetHistoryResponse = z.infer<typeof assetHistoryResponseSchema>;

export type AssetTableRow = z.infer<typeof assetTableRowSchema>;

export type PresignedURL = z.infer<typeof presignedURLSchema>;

// ============================================================================
// NEW — Asset Options / Create Job
// ============================================================================
//
// These schemas are specifically for the asset-selection flow in
// CreateJobForm.
//
// Existing schemas above are unchanged.
// ============================================================================

// -----------------------------------------------------------------------------
// Asset Option
// -----------------------------------------------------------------------------
//
// Lightweight representation of an existing asset.
//
// We deliberately do NOT extend AssetAPIResponse because the Create Job form
// does not need images, verification history, manufacturer information, etc.
// -----------------------------------------------------------------------------

export const assetOptionSchema = z.object({
  id: z.string(),
  assetID: z.string(),
});

export type AssetOption = z.infer<typeof assetOptionSchema>;

// -----------------------------------------------------------------------------
// Equipment Option
// -----------------------------------------------------------------------------
//
// Equipment can exist without a valid assetID.
//
// Example:
//   equipment: "Stainless Double Sink"
//   assetID: "nan"
//
// In this case the equipment remains selectable, but assets is empty.
//
// This supports the damaged/lost barcode workflow.
// -----------------------------------------------------------------------------

export const assetEquipmentOptionSchema = z.object({
  name: z.string(),

  assets: z.array(assetOptionSchema),

  hasVerifiedAssets: z.boolean(),
});

export type AssetEquipmentOption = z.infer<typeof assetEquipmentOptionSchema>;

// -----------------------------------------------------------------------------
// Area Option
// -----------------------------------------------------------------------------

export const assetAreaOptionSchema = z.object({
  name: z.string(),

  equipment: z.array(assetEquipmentOptionSchema),
});

export type AssetAreaOption = z.infer<typeof assetAreaOptionSchema>;

// -----------------------------------------------------------------------------
// Location Option
// -----------------------------------------------------------------------------

export const assetLocationOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export type AssetLocationOption = z.infer<typeof assetLocationOptionSchema>;

// ============================================================================
// NEW — Asset Options API Responses
// ============================================================================

// -----------------------------------------------------------------------------
// Level 1 — Locations
// -----------------------------------------------------------------------------
//
// GET /api/assets/options
//
// Response:
// {
//   success: true,
//   level: "location",
//   locations: [...]
// }
// -----------------------------------------------------------------------------

export const assetLocationsResponseSchema = z.object({
  success: z.boolean(),
  level: z.literal("location"),
  locations: z.array(assetLocationOptionSchema),
});

export type AssetLocationsResponse = z.infer<
  typeof assetLocationsResponseSchema
>;

// -----------------------------------------------------------------------------
// Level 2 — Location Hierarchy
// -----------------------------------------------------------------------------
//
// GET /api/assets/options?location=Maitland
//
// Returns:
//
// Location
//   └── Area
//        └── Equipment
//             └── Verified Assets
// -----------------------------------------------------------------------------

export const assetLocationHierarchyResponseSchema = z.object({
  success: z.boolean(),
  level: z.literal("area"),
  location: z.string(),
  areas: z.array(assetAreaOptionSchema),
});

export type AssetLocationHierarchyResponse = z.infer<
  typeof assetLocationHierarchyResponseSchema
>;

// -----------------------------------------------------------------------------
// Level 3 — Equipment
// -----------------------------------------------------------------------------
//
// GET /api/assets/options?location=Maitland&area=Sales%20Floor
// -----------------------------------------------------------------------------

export const assetEquipmentResponseSchema = z.object({
  success: z.boolean(),
  level: z.literal("equipment"),
  location: z.string(),
  area: z.string(),
  equipment: z.array(assetEquipmentOptionSchema),
});

export type AssetEquipmentResponse = z.infer<
  typeof assetEquipmentResponseSchema
>;

// -----------------------------------------------------------------------------
// Level 4 — Assets
// -----------------------------------------------------------------------------
//
// GET /api/assets/options
//     ?location=Maitland
//     &area=Sales%20Floor
//     &equipment=Fridge
//
// Only assets with a valid assetID are returned.
//
// "nan", null, empty strings, etc. are excluded.
// -----------------------------------------------------------------------------

export const assetOptionsResponseSchema = z.object({
  success: z.boolean(),
  level: z.literal("asset"),
  location: z.string(),
  area: z.string(),
  equipment: z.string(),
  assets: z.array(assetOptionSchema),

  // Allows the frontend to provide the damaged/missing
  // barcode workflow when no verified asset ID exists.
  allowUnidentifiedAsset: z.boolean(),
});

export type AssetOptionsResponse = z.infer<typeof assetOptionsResponseSchema>;

// ============================================================================
// NEW — Asset Options Error Response
// ============================================================================

export const assetOptionsErrorSchema = z.object({
  success: z.literal(false),

  error: z.object({
    code: z.enum([
      "INVALID_REQUEST",
      "LOCATION_NOT_FOUND",
      "AREA_NOT_FOUND",
      "EQUIPMENT_NOT_FOUND",
      "DYNAMODB_ERROR",
      "INTERNAL_ERROR",
    ]),

    message: z.string(),
  }),
});

export type AssetOptionsError = z.infer<typeof assetOptionsErrorSchema>;

// ============================================================================
// NEW — Asset Identification Status
// ============================================================================
//
// Used by CreateJobForm when an asset exists but its barcode cannot be
// identified.
//
// verified
//     → normal asset selection
//
// barcode_unreadable
//     → asset exists but barcode cannot be read
//
// barcode_missing
//     → asset exists but barcode is missing
// -----------------------------------------------------------------------------

export const assetIdentificationStatusSchema = z.enum([
  "verified",
  "barcode_unreadable",
  "barcode_missing",
]);

export type AssetIdentificationStatus = z.infer<
  typeof assetIdentificationStatusSchema
>;

/* -------------------------------------------------------------------------- */
/*                                 OLD SCHEMAS                                 */
/* -------------------------------------------------------------------------- */

// import * as z from "zod";
// import { metricValuesSchema } from "@/schemas/metricSchemas";

// // $ Schema to create a new asset
// export const assetRequestSchema = z.object({
//   business_unit: z.string().min(1, { message: "Business unit required" }),
//   area: z.string().min(1, { message: "Area is required" }),
//   equipment: z.string().min(1, { message: "Please select a equipment" }),
//   assetID: z.string().min(1, {
//     message: "Please enter asset id",
//   }),
//   condition: z.string().min(1, { message: "Please select condition" }),
//   location: z.string().min(1, { message: "Please select a location" }),
//   serialNumber: z.string().optional(),
//   additional_notes: z.string().optional(),

//   // NEW uploads only
//   images: z.array(z.instanceof(File)).default([]),
// });

// export type AssetRequestFormValues = z.infer<typeof assetRequestSchema>;

// // $ Schema for the PresignedURL's
// export const presignedURLSchema = z.object({
//   bucket: z.string(),
//   filename: z.string(),
//   url: z.string(),
//   key: z.string(),
//   content_type: z.string(),
// });

// // $ Schema for the API Response from the database when fetching the assets with image urls
// export const assetApiResponseSchema = assetRequestSchema
//   .omit({ images: true })
//   .extend({
//     id: z.string(),
//     createdAt: z.string(),
//     images: z.array(presignedURLSchema).default([]), // existing images (urls/keys)
//   })
//   .extend({
//     // asset verification fields
//     verified_by: z.string(),
//     last_verified_at: z.string(),
//     next_verification_due: z.string(),
//     verified_location: z.object({
//       longitude: z.number(),
//       latitude: z.number(),
//     }),
//     verify_status: z.enum(["verified", "overdue", "due soon", "not found"]),
//   });

// export type AssetAPIResponse = z.infer<typeof assetApiResponseSchema>;

// // $ Type for sending the asset images to the backend excluding the images (the images is not included with the initial request)
// export type CreateAssetPayload = Omit<AssetRequestFormValues, "images"> & {
//   images: {
//     filename: string;
//     content_type: string;
//   }[];
// };

// export const assetHistoryItemSchema = z.object({
//   // from requests table
//   id: z.string(),
//   jobCreated: z.string().nullable(),
//   description: z.string().nullable(),
//   equipment: z.string().nullable(),

//   // from actions table
//   location: z.string(),
//   assetID: z.string(),
//   jobcardNumber: z.string().nullable(),
//   sundries: z.array(z.unknown()).nullable(),
//   total_cost_sundries: z.number().nullable(),
//   parts: z.array(z.unknown()).nullable(),
//   total_cost_parts: z.number().nullable(),
//   contractor: z.string().nullable(),
//   total_cost_contractor: z.number().nullable(),
//   actioned_by: z.string().nullable(),
//   completed_at: z.string().nullable(),
// });

// export const reliabilitySchema = z.array(
//   z.object({
//     name: z.enum(["MTBF", "MTTR", "Availability", "Failure Count"]),
//     value: z.number(),
//   }),
// );

// // export type Reliability = z.infer<typeof reliabilitySchema>;
// export type Reliability = z.infer<typeof reliabilitySchema>[number];

// export type AssetHistoryItem = z.infer<typeof assetHistoryItemSchema>;

// export const assetHistoryResponseSchema = z.object({
//   assetID: z.string(),
//   last_completed_job: z.string(),
//   metrics: {
//     completedRequests: metricValuesSchema,
//     inProgressRequests: metricValuesSchema,
//     pendingRequests: metricValuesSchema,
//     total_cost: metricValuesSchema,
//   },
//   reliability: reliabilitySchema,
//   history: z.array(assetHistoryItemSchema),
//   total_cost_by_month: z.record(
//     z.string(), // year e.g. "2026"
//     z.array(
//       z.object({
//         name: z.string(), // "Jan", "Feb", etc.
//         value: z.number(), // cost
//       }),
//     ),
//   ),
// });

// // $ Schema for the Asset Verification request to backend
// export const assetVerificationSchema = z.object({
//   assetID: z.string(),
//   latitude: z.number(),
//   longitude: z.number(),
// });

// // $ Schema for the Asset Verification History API response
// export const assetVerificationHistorySchema = z.object({
//   id: z.string(),
//   assetID: z.string(),
//   verified_by: z.string(),
//   last_verified_at: z.string(),
//   next_verification_due: z.string(),
//   verified_location: z.object({
//     longitude: z.number(),
//     latitude: z.number(),
//   }),
//   verify_status: z.enum([
//     "verified",
//     "overdue",
//     "due soon",
//     "not found",
//     "pending",
//   ]),
// });

// // $ Schema for the Asset Table Menu
// export const assetTableRowSchema = assetRequestSchema
//   .omit({
//     business_unit: true,
//     images: true,
//   })
//   .extend({
//     id: z.string(),
//     createdAt: z.string(),
//   });

// export type AssetAPIVerificationHistory = z.infer<
//   typeof assetVerificationHistorySchema
// >;

// export const assetVerificationResponseSchema = z.object({
//   message: z.string(),
// });

// export type VerifyAssetRequest = z.infer<typeof assetVerificationSchema>;

// export type VerifyAssetResponse = z.infer<
//   typeof assetVerificationResponseSchema
// >;

// export type AssetHistoryResponse = z.infer<typeof assetHistoryResponseSchema>;

// export type AssetTableRow = z.infer<typeof assetTableRowSchema>;

// export type PresignedURL = z.infer<typeof presignedURLSchema>;

// // # type use to fetch all the assets e.g. data from database with presignedURLS

// // type WithImages = {
// //   presignedURLs?: PresignedUrlResponse[];
// // };
