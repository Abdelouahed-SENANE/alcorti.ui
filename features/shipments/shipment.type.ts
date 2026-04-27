import { Entity } from "@/types/api";
import { User } from "../users/user.type";
import { Category } from "../categories/category.type";
import { Location } from "../locations/location.type";

export const ORDER_KEYS = {
  all: ["orders"],
  list: () => [...ORDER_KEYS.all, "list"],
  lists: (params: any) => [...ORDER_KEYS.list(), params],
  details: () => [...ORDER_KEYS.all, "details"],
  detail: (id: string) => [...ORDER_KEYS.details(), id],
  order_offers: (id: string) => [...ORDER_KEYS.detail(id), "order-offers"],
};

export type OrderStatus =
  | "pending"
  | "published"
  | "assigned"
  | "expired"
  | "delivered"
  | "rejected"
  | "cancelled";

  export type OfferStatus =
  | "pending"
  | "accepted"
  | "cancelled";


export type ShipmentOrderAbilities = {
  can_publish: boolean;
  can_assign: boolean;
  can_reject: boolean;
  can_deliver: boolean;
  can_submit_offer: boolean;
  shipper_already_placed_offer: boolean;
  offers_limit_reached: boolean;
};

export type ShipmentOffer = Entity<{
  status: OfferStatus;
  shipper?: {
    id: string;
    full_name: string;
    avatar: string;
  };
  order?: ShipmentOrder;
  created_at: string;
  updated_at: string;
}>;

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
  timelines?: ShipmentOrderTimeline[];
  abilities?: ShipmentOrderAbilities;
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
  abilities?: ShipmentOrderAbilities;
}>;

export type ShipmentOrderFilters = {
  category_id?: string;
  origin_id?: string;
  destination_id?: string;
  status?: OrderStatus;
  from_date?: Date;
  to_date?: Date;
};
