import { Entity } from "@/types/api";

export const LOCATION_KEYS = {
  all: ["locations"],
  lists: () => [...LOCATION_KEYS.all, "list"],
  list: (params: any) => [...LOCATION_KEYS.lists(), params],
  list_options: () => [...LOCATION_KEYS.all, "options"],
  list_option: (term?: string) => [...LOCATION_KEYS.list_options(), term],
};

export type Location = Entity<{
  name_ar: string;
  name_en: string;
  name_fr: string;
  lat: number;
  lng: number;
}>;

export type LocationOption = {
  value: string;
  name_ar: string;
  name_en: string;
  name_fr: string;
};
