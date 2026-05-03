import { Entity } from "@/types/api";
import { Attachment } from "../attachments/attachments.type";
import { Vehicle } from "../vehicles/vehicle.type";
import { UserParams } from "./api/user.list";

export type User = Entity<{
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  phone: string;
  cin: string;
  avatar?: string;
  is_completed: boolean;
  status: "pending" | "approved" | "rejected";
  reason?: string;
  attachments?: Attachment[];
}>;

export type ContactInfo = Entity<{
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar?: string;
  vehicle?: Vehicle;
}>;



export type ShipperOption = {
  id: string;
  first_name: string;
  last_name: string;
};

export const userKeys = {
  all: ["admin:users"] as const,
  collections: () => [...userKeys.all, "collections"] as const,
  collection: (params: UserParams) =>
    [...userKeys.collections(), params] as const,
  details: () => [...userKeys.all, "details"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  shipper_options: (search?: string) =>
    [...userKeys.all, "shippers_options", search] as const,
};
