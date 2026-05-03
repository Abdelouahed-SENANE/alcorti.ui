export type NotificationType =
  | "default"
  | "profile_completed"
  | "order_created"
  | "order_published"
  | "offer_submitted"
  | "offer_accepted_by_admin"
  | "offer_accepted_by_client"
  | "order_assigned";


export interface Notification {
  id: string;
  data: any;
  read_at: string | null;
  created_at: string;
}

// Lightweight response from /check
export interface NotificationCheckResponse {
  unread_count: number;
}

// Full list response from /notifications
export interface NotificationListResponse {
  items: Notification[];
  has_more: boolean;
  next_cursor: string | null;
}
