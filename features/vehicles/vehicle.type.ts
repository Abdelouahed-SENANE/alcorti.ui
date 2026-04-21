import { Entity } from "@/types/api";

export const VEHICLE_KEYS = {
    all: ["vehicles"],
    lists: () => [...VEHICLE_KEYS.all, "list"],
    list: (params: any) => [...VEHICLE_KEYS.lists(), params],
    list_options: () => [...VEHICLE_KEYS.all, "options"],
    list_option: (term?: string) => [...VEHICLE_KEYS.list_options(), term],
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