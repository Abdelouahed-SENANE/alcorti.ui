import { Entity } from "@/types/api";

export const CATEGORY_KEYS = {
  all: ["categories"],
  lists: () => [...CATEGORY_KEYS.all, "list"],
  list: (params: any) => [...CATEGORY_KEYS.lists(), params],
  list_options: () => [...CATEGORY_KEYS.all, "options"],
};

export type Category = Entity<{
  name_ar: string;
  name_fr: string;
  icon_name: string;
}>;

export type CategoryOption = {
  id: string;
  name_ar: string;
  name_fr: string;
};
