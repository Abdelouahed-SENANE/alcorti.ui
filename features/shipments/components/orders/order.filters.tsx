"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card/card";
import { SelectField } from "@/components/ui/form";
import { InputCalendar } from "@/components/ui/form/input-calander";
import { LocationSelector } from "@/features/locations/components/location.selector";
import { LocationOption } from "@/features/locations/location.type";
import { cn } from "@/lib/utils";
import { Filter, RefreshCcw } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { MyOrdersParams } from "../../api/orders/my.orders";
import { OrderStatus } from "../../shipment.type";

interface OrderFiltersProps {
  onFilter: (params: Omit<MyOrdersParams, "cursor">) => void;
  className?: string;
}

export const OrderFilters = ({ onFilter, className }: OrderFiltersProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<Omit<MyOrdersParams, "cursor">>({
    origin_id: undefined,
    destination_id: undefined,
    status: undefined,
    from_date: undefined,
    to_date: undefined,
  });

  const handleFilter = () => {
    onFilter(filters);
  };

  const clearFilters = () => {
    const cleared = {
      origin_id: undefined,
      destination_id: undefined,
      status: undefined,
      from_date: undefined,
      to_date: undefined,
    };
    setFilters(cleared);
    onFilter(cleared);
  };

  const statusOptions: { value: OrderStatus | "all"; label: string }[] = [
    { value: "all", label: t("global.status.all") },
    { value: "pending", label: t("shipments.orders.status.pending") },
    { value: "under_review", label: t("shipments.orders.status.under_review") },
    { value: "published", label: t("shipments.orders.status.published") },
    {
      value: "order_submitted",
      label: t("shipments.orders.status.order_submitted"),
    },
    { value: "assigned", label: t("shipments.orders.status.assigned") },
    { value: "in_transit", label: t("shipments.orders.status.in_transit") },
    { value: "delivered", label: t("shipments.orders.status.delivered") },
    { value: "completed", label: t("shipments.orders.status.completed") },
    { value: "cancelled", label: t("shipments.orders.status.cancelled") },
  ];

  return (
    <div className={cn("space-y-4")}>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t("shipments.orders.title")}
          </h1>
          <p className="text-foreground/60">
            {t("shipments.orders.description")}
          </p>
        </div>
        <Button onClick={() => setIsOpen(!isOpen)}>
          <Filter className="size-4" />
          {t("shipments.orders.filter")}
        </Button>
      </div>

      {isOpen && (
        <Card
          className={cn("overflow-hidden p-0 border-border bg-card", className)}
        >
          <div>
            <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-2 p-5 ">
              <div className="space-y-2">
                <LocationSelector
                  label={t("shipments.orders.filters.origin", "Origin")}
                  placeholder={t(
                    "shipments.orders.filters.origin_placeholder",
                    "Origin",
                  )}
                  defaultValue={filters.origin_id}
                  onSelect={(loc: LocationOption) =>
                    setFilters((prev) => ({
                      ...prev,
                      origin_id: loc.value,
                    }))
                  }
                />
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <LocationSelector
                  label={t(
                    "shipments.orders.filters.destination",
                    "Destination",
                  )}
                  placeholder={t(
                    "shipments.orders.filters.destination_placeholder",
                    "Destination",
                  )}
                  defaultValue={filters.destination_id}
                  onSelect={(loc: LocationOption) =>
                    setFilters((prev) => ({
                      ...prev,
                      destination_id: loc.value,
                    }))
                  }
                />
              </div>

              {/* Status */}

              {/* From Date */}
              <div className="space-y-2">
                <InputCalendar
                  label={t("shipments.orders.filters.from_date", "From Date")}
                  value={
                    filters.from_date ? new Date(filters.from_date) : undefined
                  }
                  onChange={(date) =>
                    setFilters((prev) => ({
                      ...prev,
                      from_date: date?.toISOString(),
                    }))
                  }
                />
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <InputCalendar
                  label={t("shipments.orders.filters.to_date", "To Date")}
                  value={
                    filters.to_date ? new Date(filters.to_date) : undefined
                  }
                  onChange={(date) =>
                    setFilters((prev) => ({
                      ...prev,
                      to_date: date?.toISOString(),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <SelectField
                  label={t("shipments.orders.filters.status", "Status")}
                  options={statusOptions}
                  value={filters.status ?? "all"}
                  onChange={(val) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: val === "all" ? undefined : (val as OrderStatus),
                    }))
                  }
                  placeholder={t(
                    "shipments.orders.filters.status_placeholder",
                    "Any Status",
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-border/50">
              <Button
                className="gap-2 bg-secondary text-secondary-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                onClick={clearFilters}
              >
                <RefreshCcw className="size-4" />
                {t("global.reset", "Reset")}
              </Button>
              <Button
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                onClick={handleFilter}
              >
                <Filter className="size-4" />
                {t("global.filter", "Apply Filters")}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
