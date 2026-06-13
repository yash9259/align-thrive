import { supabase } from "./supabase";

export type NotificationType = "message" | "bid" | "campaign" | "payment" | "system";

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  data?: Record<string, any>;
  email?: string;
}

const showBrowserNotification = async (title: string, body?: string) => {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  if (Notification.permission === "default") {
    await Notification.requestPermission().catch(() => undefined);
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body: body || "", tag: "align-thrive-notification" });
  }
};

const openMailComposer = (email: string, title: string, body?: string) => {
  if (typeof window === "undefined") return;

  const subject = encodeURIComponent(title || "AlignThrive notification");
  const message = encodeURIComponent(body || "");
  window.open(`mailto:${email}?subject=${subject}&body=${message}`, "_blank", "noopener,noreferrer");
};

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
      return;
    }

    void showBrowserNotification(input.title, input.body);
    if (input.email) {
      openMailComposer(input.email, input.title, input.body);
    }
  } catch (err) {
    console.error("Failed to run createNotification:", err);
  }
};
