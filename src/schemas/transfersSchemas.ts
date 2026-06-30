import * as z from "zod";
import { assetRequestSchema } from "./assetSchemas";
// import { PresignedURL } from "./assetSchemas";

// $ Schema to create a maintenance request
export const transferRequestSchema = assetRequestSchema
  .pick({
    assetID: true,
    business_unit: true,
    area: true,
    images: true,
    equipment: true,
  })
  .extend({
    assetID: z.string().optional(), // override assetID to make it optional
    locationFrom: z.string().min(1, { message: "Please select a location" }),
    locationTo: z.string().min(1, { message: "Please select a location" }),
    expectedTransferDate: z
      .string()
      .min(1, { message: "Please enter expected date for transfer" }),
    transferReason: z.string().min(1, {
      message: "Give a brief description reason for transfer request",
    }),
    // hasBarcode: z.string().optional(),
    // description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.locationFrom === data.locationTo) {
      ctx.addIssue({
        code: "custom",
        path: ["locationTo"],
        message: "The location To must be different from the current location.",
      });
    }

    const selectedDate = new Date(data.expectedTransferDate);

    // Set today's time to midnight so only the date is compared
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      ctx.addIssue({
        code: "custom",
        path: ["expectedTransferDate"],
        message: "The expected transfer date cannot be in the past.",
      });
    }

    // if (data.hasBarcode === "yes" && !data.assetID?.trim()) {
    //   ctx.addIssue({
    //     code: "custom",
    //     path: ["assetID"],
    //     message: "Please enter the asset ID.",
    //   });
    // }

    // if (data.hasBarcode === "no" && !data.description?.trim()) {
    //   ctx.addIssue({
    //     code: "custom",
    //     path: ["description"],
    //     message: "Please enter a description or serial number.",
    //   });
    // }
  });

export type TransferRequestFormValues = z.infer<typeof transferRequestSchema>;
