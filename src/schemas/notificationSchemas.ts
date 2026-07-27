import { z } from "zod";

export const notifcationTypeSchema = z.enum([
  "TRANSFER_APPROVED",
  "TRANSFER_REJECTED",
  "TRANSFER_REQUEST_SUBMITTED",
  "TRANSFER_IN_TRANSIT",
  "TRANSFER_RECEIVED",
  "TRANSFER_CANCELLED",
  "JOB_ASSIGNED",
  "JOB_COMPLETED",
  "JOB_OVERDUE",
  "CLOCK_OUT_REMINDER",
  "APPROVAL_REMINDER",
  "LEAVE_APPROVED",
  "LEAVE_REJECTED",
  "LEAVE_REQUEST_SUBMITTED",
  "ANNOUNCEMENT",
]);

export const notificationSchema = z.object({
  id: z.uuid(),
  transferId: z.uuid().optional(),

  recipientSub: z.string(),
  notificationCreated: z.string(), // Return date in ISO format
  notificationCreatedDisplay: z.string(), // Return the date in human readible format

  recipientEmail: z.email(),
  assetId: z.string(),

  type: notifcationTypeSchema,
  title: z.string().min(1),
  message: z.string().min(1),
  location: z.string(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
  status: z.enum(["UNREAD", "READ", "ARCHIVED"]),

  channels: z.array(z.enum(["IN_APP", "EMAIL", "PUSH", "SMS"])),
});

export const notificationsResponseSchema = z.object({
  counts: z.object({
    all: z.number(),
    unread: z.number(),
    read: z.number(),
    archived: z.number(),
  }),

  notifications: z.object({
    all: z.array(notificationSchema),
    unread: z.array(notificationSchema),
    read: z.array(notificationSchema),
    archived: z.array(notificationSchema),
  }),
});

export const notificationPayloadSchema = notificationSchema.pick({
  id: true,
  recipientSub: true,
  notificationCreated: true,
  status: true,
});

export type Notification = z.infer<typeof notificationSchema>;
export type NotificationPayload = z.infer<typeof notificationPayloadSchema>;
export type NotificationResponse = z.infer<typeof notificationsResponseSchema>;
export type NotificationType = z.infer<typeof notifcationTypeSchema>;
