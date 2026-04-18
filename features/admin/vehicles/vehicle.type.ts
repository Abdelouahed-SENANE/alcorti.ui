import { Entity } from "@/types/api";

export const VEHICLE_KEYS = {
    all: ["vehicles"],
    list: (params: any) => ["vehicles", "list", params],
    options: (term?: string) => ["vehicles", "options", term],
}

export type Vehicle = Entity<{
    brand: string;
    model: string;
    year: number;
    price_km: number;
}>
export type VehicleOption = {
    value: string;
    label: string;
}