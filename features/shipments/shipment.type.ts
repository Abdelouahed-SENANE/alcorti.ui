import { Entity } from "@/types/api";
import { Location } from "../locations/location.type";
import { Category } from "../categories/category.type";

export const SHIPMENT_KEYS = {
  all: ["shipments"],
  lists: () => [...SHIPMENT_KEYS.all, "list"],
  list: (params: any) => [...SHIPMENT_KEYS.lists(), params],
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
  items : ShipmentOrderItem[]
}>;
