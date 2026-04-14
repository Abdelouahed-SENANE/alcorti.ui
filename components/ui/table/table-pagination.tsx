"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { useDirection } from "@/hooks/use-direction";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../form";
import { RouterLink } from "../link";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("flex w-full items-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1.5", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("w-full h-full flex items-center justify-center", className)}
    {...props}
  />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
} & { size?: "default" | "icon" | "sm" | "lg" } & React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  disabled,
  children,
  href,
  ...props
}: PaginationLinkProps) => (
  <RouterLink
    to={disabled ? "#" : (href as string)}
    aria-current={isActive ? "page" : undefined}
    aria-disabled={disabled}
    className={cn(
      "flex items-center justify-center bg-input/60 size-7.5 rounded-sm transition-colors hover:no-underline text-sm font-semibold",
      isActive
        ? "bg-primary text-primary-foreground font-semibold"
        : "text-card-foreground/70 hover:bg-card-foreground/20 font-semibold",
      disabled && "opacity-50  pointer-events-none cursor-not-allowed",
      className,
    )}
    {...props}
  >
    {children}
  </RouterLink>
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    size="sm"
    disabled={disabled}
    aria-label="Go to previous page"
    className={cn("px-2", className)}
    {...props}
  >
    <ChevronLeft className="size-5 rtl:rotate-180" />
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    disabled={disabled}
    aria-label="Go to next page"
    className={cn("px-2", className)}
    {...props}
  >
    <ChevronRight className="size-5 rtl:rotate-180" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn(
      "flex h-9 w-9 items-center justify-center text-card-foreground bg-muted/20 rounded-md",
      className,
    )}
    {...props}
  >
    <Ellipsis className="size-5" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};

export interface TablePaginationProps {
  total: number;
  page: number;
  limit: number;
  rootUrl: string;
}

export const TablePagination = ({
  total,
  page,
  limit,
  rootUrl,
}: TablePaginationProps) => {
  const totalPages = Math.ceil(total / limit);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dir = useDirection();

  const setSearchParams = (params: URLSearchParams) => {
    router.push(`${pathname}?${params.toString()}`);
  };

  const createHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    params.set("limit", String(limit));
    return `${rootUrl}?${params.toString()}`;
  };

  const handlePerPageChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("limit", value);
    setSearchParams(params);
  };

  const renderPageItems = useMemo(() => {
    const delta = 2;
    const items: React.ReactNode[] = [];
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          size="sm"
          href={createHref(1)}
          isActive={page === 1}
          className={cn(
            "text-sm",
            page === 1
              ? " bg-primary text-primary-foreground font-semibold "
              : "hover:bg-border text-card-foreground",
          )}
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    if (left > 2) {
      items.push(
        <PaginationItem key="left-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    for (let i = left; i <= right; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            size="sm"
            aria-current={page === i ? "page" : undefined}
            href={createHref(i)}
            className={cn(
              "text-sm",
              page === i
                ? " bg-primary text-primary-foreground font-semibold "
                : "hover:bg-border text-card-foreground",
            )}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (right < totalPages - 1) {
      items.push(
        <PaginationItem key="right-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            size="sm"
            href={createHref(totalPages)}
            className={cn(
              "text-sm",
              page === totalPages
                ? " bg-primary text-primary-foreground font-bold "
                : "hover:bg-border text-card-foreground",
            )}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  }, [page, totalPages, dir]);

  const { t } = useTranslation();
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <Pagination
      className={cn(
        "w-full items-center py-2 px-2 flex flex-col gap-3 sm:flex-row sm:justify-between",
      )}
    >
      <div className="flex items-center gap-2 text-[15px] text-card-foreground/80 font-semibold">
        {t("global.pagination_info", { from, to, total })}
      </div>
      <PaginationContent dir={dir} className={cn("flex items-center gap-1.5")}>
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious
            href={createHref(Math.max(page - 1, 1))}
            disabled={page <= 1}
          />
        </PaginationItem>

        {/* Page numbers */}
        <div className="flex items-center gap-1.5">{renderPageItems}</div>

        {/* Next button */}
        <PaginationItem>
          <PaginationNext
            href={createHref(Math.min(page + 1, totalPages))}
            disabled={page >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>

      <div
        className={cn("flex items-center gap-3 text-[15px] whitespace-nowrap")}
      >
        <span className="text-[15px] text-card-foreground/80 font-semibold">
          {t("global.per_page")}
        </span>
        <Select value={String(limit)} onValueChange={handlePerPageChange}>
          <SelectTrigger className="h-7 text-card-foreground text-[14px] font-semibold px-2 rounded-md w-16 bg-background border-border">
            <SelectValue placeholder={String(limit)} />
          </SelectTrigger>
          <SelectContent className="bg-background" align="end">
            {[5, 10, 15, 25, 50].map((val) => (
              <SelectItem
                key={val}
                value={String(val)}
                className="text-[14px] font-semibold"
              >
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Pagination>
  );
};
