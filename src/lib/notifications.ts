import { supabase } from "./supabase";

export type NotificationType = "message" | "bid" | "campaign" | "payment" | "system";

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  data?: Record<string, any>;
}

/**
 * Creates a notification in the database for the given user.
 * Silently catches errors to ensure client operations are not blocked.
 */
export const createNotification = async (input: CreateNotificationInput): Promise<void> => {
  if (!supabase) {
    console.warn("Supabase is not configured; skipping notification creation.");
    return;
  }

  try {
    const { error } = await supabase.from("notifications").insert({
      user_id: input.userId,
      type: input.type,
      title: input.title,
      body: input.body || null,
      data: input.data || null,
      is_read: false,
    });

    if (error) {
      console.error("Error creating database notification:", error.message);
    }
  } catch (err) {
    console.error("Failed to run createNotification:", err);
  }
};
