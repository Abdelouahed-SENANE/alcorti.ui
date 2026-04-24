"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/icons/dynamic-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { useDisclosure } from "@/hooks/use-disclosure";
import { cn, formatDate } from "@/lib/utils";
import { Eye, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";
import { useTranslation } from "react-i18next";
import { OrderStatus, ShipmentOrder } from "../../shipment.type";

export const OrderCardSkeleton = () => {
  return (
    <Card className="group overflow-hidden border-border/60 py-0 rounded-2xl bg-card h-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="min-h-30 w-full bg-primary/5 animate-pulse" />

        <div className="space-y-4 p-4 flex-1">
          {/* Status Badge Skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Route Skeleton */}
          <div className="space-y-1.5 py-2">
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="h-6 w-0.5 mx-4 bg-muted animate-pulse" />
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Date Range Skeleton */}
          <div className="flex items-center gap-2 py-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>

          {/* Metrics Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-end py-2 px-4 border-t border-border gap-2">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
};

const OrderView = dynamic(
  () => import("./order.view").then((mod) => mod.OrderView),
  { ssr: false },
);
interface OrderCardProps {
  order: ShipmentOrder;
  className?: string;
}

const statusVariants: Record<OrderStatus, string> = {
  pending:
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/10",
  under_review:
    "bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/10",
  published:
    "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/10",
  order_submitted:
    "bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-500/10",
  assigned:
    "bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 border-indigo-500/10",
  in_transit:
    "bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/10",
  delivered:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/10",
  completed:
    "bg-slate-500/10 text-slate-600 dark:text-slate-500 border-slate-500/10",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/10",
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, className }) => {
  const { t, i18n } = useTranslation();
  const { isOpen, toggle } = useDisclosure();
  const [orderId, setOrderId] = React.useState<string | null>(null);
  const getLocalizedName = (obj: any) => {
    if (!obj) return "";
    const locale =
      i18n.language === "ar" ? "ar" : i18n.language === "fr" ? "fr" : "en";
    return (
      obj[`name_${locale}`] || obj.name_en || obj.name_ar || obj.name_fr || ""
    );
  };
  return (
    <Card
      className={cn(
        "group overflow-hidden border-border/60 py-0 rounded-2xl bg-card h-full flex flex-col",
        className,
      )}
    >
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="min-h-30 bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold">
          {order.category && (
            <div className="flex flex-col items-center gap-2">
              {order.category.icon_name && (
                <DynamicIcon
                  name={order.category.icon_name}
                  className="size-10 text-primary"
                  strokeWidth={2.5}
                />
              )}
              <span className="text-primary">
                {getLocalizedName(order.category)}
              </span>
            </div>
          )}
        </div>
        <div className="space-y-4 p-4 flex-1">
          <div className="flex items-center justify-end">
            <Badge className={statusVariants[order.status]}>
              {t(`shipments.orders.status.${order.status}`)}
            </Badge>
          </div>
          <p className="text-sm font-medium text-foreground/80 line-clamp-2 min-h-4 max-h-10">
            {order.description}
          </p>
          <div className="flex items-start justify-between gap-4 overflow-hidden">
            <div className="space-y-1.5 flex-1">
              <h3 className="flex relative flex-col items-start text-md font-bold tracking-tight text-foreground truncate">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/15 text-primary rounded-full size-8 flex items-center justify-center">
                    <MapPin className="size-4" />
                  </span>
                  <span className="truncate max-w-[260px]">
                    {getLocalizedName(order?.origin)}
                  </span>
                </div>

                <div className="min-h-4 bg-input w-0.5 mx-4 my-1"></div>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="bg-primary/15 text-primary rounded-full size-8 flex items-center justify-center">
                    <MapPin className="size-4" />
                  </span>
                  <span className="truncate max-w-[260px]">
                    {getLocalizedName(order?.destination)}
                  </span>
                </div>
              </h3>
            </div>
          </div>

          {/* Date Range */}
          <div className=" flex items-center font-medium gap-2 text-foreground/90">
            <span className="text-sm">
              {t("shipments.form.summary.available_between")} :{" "}
            </span>
            <p className="text-sm font-bold text-foreground/80">
              {formatDate(order.from_date, i18n.language)} -{" "}
              {formatDate(order.to_date, i18n.language)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm w-fit font-medium bg-primary/10 text-primary px-2 py-1 rounded-lg">
              {t("global.distance")}
              <span className="text-primary mx-1">
                {order.distance} {t("global.km")}
              </span>
            </p>

            {order.items.length > 0 && (
              <p className="text-sm w-fit font-medium bg-primary/10 text-primary px-2 py-1 rounded-lg">
                {t("global.count")}
                <span className="text-primary mx-1">
                  {t("global.item")} {order.items.length}
                </span>
              </p>
            )}
          </div>
        </div>{" "}
        {/* Footer */}
        <div className="flex items-center justify-end py-2 px-4 border-t border-border">
          <Button
            onClick={() => {
              setOrderId(order.id);
              toggle();
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1  h-8 rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95"
          >
            <Eye className="size-4" />
            {t("global.actions.view")}
          </Button>
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium gap-1  h-8 rounded-lg shadow-md shadow-secondary/20 transition-all active:scale-95 ltr:ml-2 rtl:mr-2">
            {t("global.actions.view_offers")}
          </Button>
        </div>
      </CardContent>
      {orderId && (
        <OrderView id={orderId} isOpen={isOpen} onOpenChange={toggle} />
      )}
    </Card>
  );
};
