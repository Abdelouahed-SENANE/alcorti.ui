import { BaseOption } from "@/types/api";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeToE164 = (value: string, defaultCountryCode = "+212") => {
  if (!value) return value;

  value = value.replace(/[\s\-()]/g, "");

  if (value.startsWith("+") && /^\+[1-9]\d{7,14}$/.test(value)) {
    return value;
  }

  if (value.startsWith("0")) {
    return defaultCountryCode + value.slice(1);
  }

  if (/^\d{8,14}$/.test(value)) {
    return defaultCountryCode + value;
  }

  return value;
};

export function diffObject<T extends Record<string, any>>(
  oldObj: T,
  newObj: Partial<T>,
): Partial<T> {
  const result: Partial<T> = {};

  (Object.keys(newObj) as (keyof T)[]).forEach((key) => {
    if (newObj[key] !== oldObj[key]) {
      result[key] = newObj[key];
    }
  });

  return result;
}
export const toDate = (
  value: string | Date | undefined | null,
): Date | undefined => {
  if (!value) return undefined; // ⬅ safe
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
};

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const value = bytes / Math.pow(k, i);

  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${sizes[i]}`;
}

export function normalizeFilesErrors(error: any): string[] {
  if (!error) return [];

  const messages: string[] = [];

  if (error.message) {
    messages.push(String(error.message));
  }

  // 2️⃣ Multiple errors (criteriaMode: "all")
  if (error.types) {
    Object.values(error.types).forEach((value) => {
      if (Array.isArray(value)) {
        messages.push(...value.map(String));
      } else {
        messages.push(String(value));
      }
    });
  }

  if (Array.isArray(error)) {
    error.forEach((item) => {
      if (item?.message) {
        messages.push(String(item.message));
      }
    });
  }

  return Array.from(new Set(messages));
}

export function toDateOnly(value: Date | string | undefined) {
  if (!value) return null;
  const d = new Date(value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toDateTime(value?: Date | string) {
  if (!value) return null;

  const d = new Date(value);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

export function formatDateOnly(
  date: string | Date | undefined | null,
  locale: "fr" | "ar",
) {
  if (!date) return "";
  const d = new Date(date);

  if (locale === "fr") {
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  if (locale === "ar") {
    const year = d.getFullYear();
    const month = d.toLocaleDateString("ar-MA", { month: "long" });
    const day = String(d.getDate()).padStart(2, "0");
    return `${day} ${month} ${year}`;
  }

  return d.toISOString().slice(0, 10);
}

export function formatDateTime(
  date: string | Date | undefined | null,
  locale: "fr" | "ar",
) {
  if (!date) return "";
  const d = new Date(date);

  if (locale === "fr") {
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (locale === "ar") {
    const year = d.getFullYear();
    const month = d.toLocaleDateString("ar-MA", { month: "long" });
    const day = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} في ${hour}:${minute}`;
  }

  return d.toISOString();
}

export function formatDateRange(
  from?: Date | string,
  to?: Date | string,
  locale: "fr" | "ar" = "fr",
) {
  if (!from && !to) return "";

  if (from && to) {
    return `${formatDateOnly(from, locale)} → ${formatDateOnly(to, locale)}`;
  }

  if (from) {
    return `${formatDateOnly(from, locale)} →`;
  }

  return `→ ${formatDateOnly(to!, locale)}`;
}

export function formatDateTimeRange(
  from?: Date | string,
  to?: Date | string,
  locale: "fr" | "ar" = "fr",
) {
  if (!from && !to) return "";

  if (from && to) {
    return `${formatDateTime(from, locale)} → ${formatDateTime(to, locale)}`;
  }

  if (from) {
    return `${formatDateTime(from, locale)} →`;
  }

  return `→ ${formatDateTime(to!, locale)}`;
}

export const formatCurrency = (amount: number, locale: "fr" | "ar" = "fr") =>
  new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "ar-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(amount);

export const getFirstAndLastOfCurrentMonth = () => {
  const firstOfCurrentMonth = new Date();
  firstOfCurrentMonth.setDate(1);
  firstOfCurrentMonth.setHours(0, 0, 0, 0);
  const lastOfCurrentMonth = new Date(
    firstOfCurrentMonth.getFullYear(),
    firstOfCurrentMonth.getMonth() + 1, // next month
    0,
    23,
    59,
    59,
    999,
  );
  return {
    firstOfCurrentMonth,
    lastOfCurrentMonth,
  };
};

export const handleNumericKeyDown = (
  value: string,
  maxLength: number,
  e: React.KeyboardEvent<HTMLInputElement>,
) => {
  const key = e.key;

  const isDigit = /^[0-9]$/.test(key);

  const isControlKey =
    [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
      "Escape",
    ].includes(key) ||
    e.ctrlKey ||
    e.metaKey;

  if (!isDigit && !isControlKey) {
    e.preventDefault();
    return;
  }
  if (isDigit) {
    const { selectionStart, selectionEnd } = e.currentTarget;

    const hasSelection =
      selectionStart !== null &&
      selectionEnd !== null &&
      selectionStart !== selectionEnd;

    if (value.length >= maxLength && !hasSelection) {
      e.preventDefault();
    }
  }
};

export const LabelResolver = <T extends BaseOption>(opt: T, lang: "fr" | "ar") => {
  if (typeof opt.label === "string") return opt.label;
  return opt.label[lang] ?? opt.label["fr"];
};
