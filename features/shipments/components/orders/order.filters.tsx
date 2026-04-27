"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card/card";
import { SelectField } from "@/components/ui/form";
import { InputCalendar } from "@/components/ui/form/input-calander";
import { useCategoryOptions } from "@/features/categories/api/category.options";
import { LocationSelector } from "@/features/locations/components/location.selector";
import { LocationOption } from "@/features/locations/location.type";
import { cn } from "@/lib/utils";
import { Filter, RefreshCcw, Search, SlidersHorizontal, X } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { OrderStatus } from "../../shipment.type";
import { useAuthorization } from "@/lib/auth";

interface OrderFiltersProps {
  onFilter: (params: any) => void;
  initialFilters?: any;
  titleSection?: React.ReactNode;
  alwaysOpen?: boolean;
  className?: string;
}

export const OrderFilters = ({
  onFilter,
  initialFilters,
  titleSection,
  alwaysOpen = false,
  className,
}: OrderFiltersProps) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<any>(
    initialFilters || {
      category_id: undefined,
      origin_id: undefined,
      destination_id: undefined,
      status: undefined,
      from_date: undefined,
      to_date: undefined,
    },
  );
  const { hasRole } = useAuthorization();

  const [labels, setLabels] = React.useState<any>({});

  React.useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const { data: categoryOptionsRes } = useCategoryOptions();
  const categoryOptions = React.useMemo(() => {
    const isAr = i18n.language === "ar";
    const options =
      categoryOptionsRes?.data?.map((opt) => ({
        label: isAr ? opt.name_ar : opt.name_fr, // Prefer ar if RTL, else fr
        value: opt.id,
      })) || [];
    return [{ value: "all", label: t("global.all") }, ...options];
  }, [categoryOptionsRes, t, i18n.language]);

  const statusOptions: { value: OrderStatus | "all"; label: string }[] = [
    { value: "all", label: t("global.status.all") },
    { value: "pending", label: t("shipments.orders.status.pending") },
    { value: "published", label: t("shipments.orders.status.published") },
    { value: "assigned", label: t("shipments.orders.status.assigned") },
    { value: "delivered", label: t("shipments.orders.status.delivered") },
    { value: "cancelled", label: t("shipments.orders.status.cancelled") },
  ];

  const handleFilter = () => {
    onFilter(filters);
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...filters, [key]: undefined };
    setFilters(newFilters);
    setLabels((prev: any) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const cleared = {
      category_id: undefined,
      origin_id: undefined,
      destination_id: undefined,
      status: undefined,
      from_date: undefined,
      to_date: undefined,
    };
    setFilters(cleared);
    setLabels({});
    onFilter(cleared);
  };

  const activeFilters = React.useMemo(() => {
    const active: { key: string; label: string; value: string }[] = [];
    if (filters.category_id && filters.category_id !== "all") {
      const cat = categoryOptions.find((o) => o.value === filters.category_id);
      active.push({
        key: "category_id",
        label: t("shipments.orders.filters.category", "Category"),
        value: cat?.label || filters.category_id,
      });
    }
    if (filters.origin_id) {
      active.push({
        key: "origin_id",
        label: t("shipments.orders.filters.origin", "Origin"),
        value: labels.origin_id || filters.origin_id,
      });
    }
    if (filters.destination_id) {
      active.push({
        key: "destination_id",
        label: t("shipments.orders.filters.destination", "Destination"),
        value: labels.destination_id || filters.destination_id,
      });
    }
    if (filters.status && filters.status !== "all") {
      const status = statusOptions.find((o) => o.value === filters.status);
      active.push({
        key: "status",
        label: t("shipments.orders.filters.status", "Status"),
        value: status?.label || filters.status,
      });
    }
    if (filters.from_date) {
      active.push({
        key: "from_date",
        label: t("shipments.orders.filters.from_date", "From"),
        value: new Date(filters.from_date).toLocaleDateString(),
      });
    }
    if (filters.to_date) {
      active.push({
        key: "to_date",
        label: t("shipments.orders.filters.to_date", "To"),
        value: new Date(filters.to_date).toLocaleDateString(),
      });
    }
    return active;
  }, [filters, labels, categoryOptions, statusOptions, t]);

  return (
    <div className={cn("space-y-3 ", className)}>
      {(!alwaysOpen || titleSection) && (
        <div
          className={cn(
            "flex w-full items-center gap-2",
            titleSection ? "justify-between" : "justify-start",
          )}
        >
          {titleSection && titleSection}
          {!alwaysOpen && (
            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant="default"
              className="gap-2 h-9"
              size="sm"
            >
              <SlidersHorizontal className="size-4" />
              {t("global.advanced_search")}
              {activeFilters.length > 0 && (
                <span className="flex items-center justify-center size-5 rounded-full bg-primary-foreground text-primary text-[10px] font-bold ml-1">
                  {activeFilters.length}
                </span>
              )}
            </Button>
          )}
        </div>
      )}
      {(alwaysOpen || isOpen) && (
        <Card className="overflow-hidden p-0 border-border bg-card gap-0">
          <div
            className={cn(
              "flex items-center gap-2 p-4",
            )}
          >
            {/* Category */}
            <div className="space-y-1.5 flex-1">
              <SelectField
                label={t("shipments.orders.filters.category", "Category")}
                options={categoryOptions}
                value={filters.category_id ?? "all"}
                onChange={(val) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    category_id: val === "all" ? undefined : val,
                  }))
                }
              />
            </div>

            {/* Origin */}
            <div className="space-y-1.5 flex-2">
              <LocationSelector
                label={t("shipments.orders.filters.origin", "Origin")}
                defaultValue={filters.origin_id}
                onSelect={(loc: LocationOption) => {
                  const isAr = i18n.language === "ar";
                  const label = isAr ? loc.name_ar : loc.name_fr;
                  setFilters((prev: any) => ({
                    ...prev,
                    origin_id: loc.value,
                  }));
                  setLabels((prev: any) => ({
                    ...prev,
                    origin_id: label,
                  }));
                }}
              />
            </div>

            {/* Destination */}
            <div className="space-y-1.5 flex-2">
              <LocationSelector
                label={t("shipments.orders.filters.destination", "Destination")}
                defaultValue={filters.destination_id}
                onSelect={(loc: LocationOption) => {
                  const isAr = i18n.language === "ar";
                  const label = isAr ? loc.name_ar : loc.name_fr;
                  setFilters((prev: any) => ({
                    ...prev,
                    destination_id: loc.value,
                  }));
                  setLabels((prev: any) => ({
                    ...prev,
                    destination_id: label,
                  }));
                }}
              />
            </div>

            {/* Status */}
            {hasRole({ role: "client" }) || hasRole({ role: "admin" }) && (
              <div className="space-y-1.5 flex-1">
                <SelectField
                  label={t("shipments.orders.filters.status", "Status")}
                  options={statusOptions}
                  value={filters.status ?? "all"}
                  onChange={(val) =>
                    setFilters((prev: any) => ({
                      ...prev,
                      status: val === "all" ? undefined : (val as OrderStatus),
                    }))
                  }
                />
              </div>
            )}

            {/* From Date */}
            <div className="space-y-1.5">
              <InputCalendar
                label={t("shipments.orders.filters.from_date", "From Date")}
                value={
                  filters.from_date ? new Date(filters.from_date) : undefined
                }
                onChange={(date) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    from_date: date?.toISOString(),
                  }))
                }
              />
            </div>

            {/* To Date */}
            <div className="space-y-1.5">
              <InputCalendar
                label={t("shipments.orders.filters.to_date", "To Date")}
                value={filters.to_date ? new Date(filters.to_date) : undefined}
                onChange={(date) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    to_date: date?.toISOString(),
                  }))
                }
              />
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 ltr:items-center rtl:items-start px-4 pb-3">
              {activeFilters.map((af) => (
                <Badge
                  key={af.key}
                  variant="secondary"
                  className="px-2 py-1 gap-1 text-xs h-7 text-primary bg-secondary/50 hover:bg-secondary border-none"
                >
                  <span>{af.label}:</span>
                  <span className="font-medium">{af.value}</span>
                  <button
                    onClick={() => removeFilter(af.key)}
                    className="hover:text-destructive cursor-pointer text-primary transition-colors ml-1 focus:outline-none"
                  >
                    <X className="size-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-border/50 bg-muted/5">
            {activeFilters.length > 1 ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-7 gap-1 text-destructive bg-destructive/10 hover:bg-destructive/20 hover:text-destructive px-3 py-1 "
              >
                <X className="size-4" />
                {t("global.clear_all", "Clear all")}
              </Button>
            ) : (
              <div></div>
            )}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 h-8 text-xs font-medium"
                onClick={clearFilters}
              >
                <RefreshCcw className="size-3.5" />
                {t("global.reset", "Reset")}
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-8 text-xs font-medium"
                onClick={handleFilter}
              >
                <Filter className="size-3.5" />
                {t("global.actions.apply", "Apply")}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
