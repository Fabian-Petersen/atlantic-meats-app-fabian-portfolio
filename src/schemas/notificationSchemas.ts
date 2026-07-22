import { z } from "zod";

export const notificationSchema = z.object({
  id: z.uuid(),
  transferId: z.uuid(),

  recipientSub: z.string(),
  notificationCreated: z.string(),
  notificationCreatedDisplay: z.string(),

  recipientEmail: z.email(),
  assetId: z.string(),

  type: z.string(),
  title: z.string().min(1),
  message: z.string().min(1),
  location: z.string(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
  status: z.enum(["UNREAD", "READ", "ARCHIVED"]),

  channels: z.array(z.enum(["IN_APP", "EMAIL", "PUSH", "SMS"])),
});

export const notificationPayloadSchema = notificationSchema.pick({
  id: true,
  recipientSub: true,
  notificationCreated: true,
  status: true,
});

export type Notification = z.infer<typeof notificationSchema>;
export type NotificationPayload = z.infer<typeof notificationPayloadSchema>;
