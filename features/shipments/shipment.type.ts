import { Entity } from "@/types/api";
import { Category } from "../categories/category.type";
import { Location } from "../locations/location.type";

export const SHIPMENT_KEYS = {
  all: ["shipments"],
  lists: () => [...SHIPMENT_KEYS.all, "list"],
  list: (params: any) => [...SHIPMENT_KEYS.lists(), params],
  details: () => [...SHIPMENT_KEYS.all, "details"],
  detail: (id: string) => [...SHIPMENT_KEYS.details(), id],
};

export const ADMIN_SHIPMENT_KEYS = {
  all: ["admin", "shipments"],
  lists: () => [...ADMIN_SHIPMENT_KEYS.all, "list"],
  list: (params: any) => [...ADMIN_SHIPMENT_KEYS.lists(), params],
  details: () => [...ADMIN_SHIPMENT_KEYS.all, "details"],
  detail: (id: string) => [...ADMIN_SHIPMENT_KEYS.details(), id],
};

export type OrderStatus =
  | "pending"
  | "under_review"
  | "published"
  | "order_submitted"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "completed"
  | "cancelled";

export type ShipmentOrderItem = {
  description: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  volume: number;
  unit: string;
  image_url: string;
};

export type ShipmentOrder = Entity<{
  description: string;
  category: Category;
  origin: Location;
  destination: Location;
  status: OrderStatus;
  distance: number;
  from_date: Date;
  to_date: Date;
  total_amount: number;
  total_volume: number;
  items: ShipmentOrderItem[];
  timelines: ShipmentOrderTimeline[];
}>;

export type ShipmentOrderTimeline = Entity<{
  order_id: string;
  old_status: OrderStatus;
  new_status: OrderStatus;
  created_at: Date;
}>;

export type ShipmentOrderSummary = Entity<{
  description: string;
  category: Category;
  origin: Location;
  destination: Location;
  status: OrderStatus;
  distance: number;
  from_date: Date;
  to_date: Date;
  total_amount: number;
}>;

export type ShipmentOrderFilters = {
  category_id?: string;
  origin_id?: string;
  destination_id?: string;
  status?: OrderStatus;
  from_date?: Date;
  to_date?: Date;
};
