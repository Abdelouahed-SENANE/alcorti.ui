export type BaseEntity = {
  id: string;
  created_at?: string;
  updated_at?: string;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type Lang = "ar" | "fr" | "en";
export type Translation = Record<Lang, string>;

export type Jwt = {
  access_token: string;
  token_type?: string;
  refresh_token?: string;
  expires_in?: number;
};

export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  timestamp?: string;
  data?: T | null;
  errors?: Record<string, string[]>;
};

export type Paginated<T> = {
  items: T[];
  pagination?: Pagination;
  sort?: Sorting;
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  offset: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

type Sorting = {
  sort_by: string;
  sort_order: "asc" | "desc";
};

export type Cursor = {
  next_cursor: string | null;
  prev_cursor: string | null;
  per_page: number;
  has_more: boolean;
  path: string;
};

export type CursorPaginated<T> = {
  items: T[];
  cursor: Cursor;
};

export type BaseOption = {
  label: string | Translation;
  value: string;
  [key: string]: any;
};

export type ROLES = "admin" | "client" | "shipper";

export type AuthUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role?: ROLES;
  avatar?: string;
  is_active?: boolean;
  is_completed?: boolean;
  status?: string;
  rejection_reason?: string | null;
};

export type ApiError<T = any> = {
  response?: {
    data: ApiResponse<T>;
  };
  message: string;
};
