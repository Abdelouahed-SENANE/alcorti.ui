import { BaseOption, Lang } from "@/types/api";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveLocaleValue(
  value: {
    name_ar: string;
    name_en?: string;
    name_fr: string;
  },
  locale: string,
): string {
  if (!value) return "-";
  return locale === "ar"
    ? value.name_ar
    : locale === "fr"
      ? value.name_fr
      : value?.name_en || "-";
}
export function formatDate(dateString: string | Date, locale: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string, locale: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(dateString: string, locale: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(
  value: number,
  locale: string,
  currency: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

export function handleNumericKeyDown(e: any) {
  if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
    e.preventDefault();
  }
}

export function LabelResolver(opt: BaseOption, lang: Lang): string {
  if (!opt?.label) return "-";
  if (typeof opt.label === "string") return opt.label;
  return (opt.label as any)[lang] || "-";
}
