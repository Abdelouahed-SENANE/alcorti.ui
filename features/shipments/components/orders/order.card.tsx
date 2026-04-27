"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/icons/dynamic-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useAuthorization } from "@/lib/auth";
import { cn, formatDate, formatDateTime } from "@/lib/utils";
import { Calendar1, Eye, HandCoins, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";
import { useTranslation } from "react-i18next";
import { OrderStatus, ShipmentOrder } from "../../shipment.type";
import { OrderOffersView } from "../offers/offers.view";

export const OrderCardSkeleton = () => {
  return (
    <Card className="group overflow-hidden border-border/60 py-0 rounded-2xl bg-card h-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="min-h-32 w-full bg-primary/5 animate-pulse" />

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

export const getLocalizedName = (obj: any, language: string) => {
  if (!obj) return "";
  const locale = language === "ar" ? "ar" : language === "fr" ? "fr" : "en";
  return (
    obj[`name_${locale}`] || obj.name_en || obj.name_ar || obj.name_fr || ""
  );
};

interface BaseOrderCardProps {
  order: ShipmentOrder;
  className?: string;
}

export const backgroundColors: Record<OrderStatus, string> = {
  pending: "bg-amber-500 text-amber-600 ",
  published: "bg-green-500 text-green-600 ",
  assigned: "bg-violet-500 text-violet-600 ",
  delivered: "bg-emerald-500 text-emerald-600 ",
  rejected: "bg-neutral-500 text-neutral-600 ",
  cancelled: "bg-slate-500 text-slate-600 ",
  expired: "bg-stone-500 text-stone-600 ",
};

export const statusColors: Record<OrderStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 ",
  published: "bg-green-500/10 text-green-600 ",
  assigned: "bg-violet-500/10 text-violet-600 ",
  delivered: "bg-emerald-500/10 text-emerald-600 ",
  rejected: "bg-neutral-500/10 text-neutral-600 ",
  cancelled: "bg-slate-500/10 text-slate-600 ",
  expired: "bg-stone-500/10 text-stone-600 ",
};

export const offerBackgroundColors: Record<string, string> = {
  pending: "bg-amber-500 text-amber-600 ",
  accepted: "bg-green-500 text-green-600 ",
  cancelled: "bg-neutral-500 text-neutral-600 ",
};

export const offerStatusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 ",
  accepted: "bg-green-500/10 text-green-600 ",
  cancelled: "bg-neutral-500/10 text-neutral-600 ",
};

export const ClientOrderCard: React.FC<BaseOrderCardProps> = ({
  order,
  className,
}) => {
  const { t, i18n } = useTranslation();
  const { isOpen: isOrder, toggle: toggleOrder } = useDisclosure();
  const { isOpen: isOffers, toggle: toggleOffers } = useDisclosure();
  const [orderId, setOrderId] = React.useState<string | null>(null);

  const bgClass = backgroundColors[order.status];
  const statusClass = statusColors[order.status];
  const statusText = t(`shipments.orders.status.${order.status}`);

  return (
    <Card
      className={cn(
        "group overflow-hidden border-border/60 py-0 rounded-2xl bg-card h-full flex flex-col",
        className,
      )}
    >
      <CardContent className="p-0 flex-1 flex flex-col">
        <div
          className={cn(
            "min-h-36 relative flex items-center justify-center text-xl font-semibold",
            bgClass,
          )}
        >
          {order.category && (
            <div className="flex flex-col items-center mb-4 ">
              {order.category.icon_name && (
                <DynamicIcon
                  name={order.category.icon_name}
                  className="size-12 text-white"
                  strokeWidth={2}
                />
              )}
              <span className="text-white text-2xl font-medium">
                {getLocalizedName(order.category, i18n.language)}
              </span>
            </div>
          )}
          <div className="text-white text-sm flex items-center gap-1 absolute bottom-1 rtl:right-2 ltr:left-2 px-3 py-1 rounded-md bg-white/10 ">
            <span className="font-medium flex items-center gap-0.5">
              <Calendar1 className="size-4" /> {t("global.created_at")}
            </span>
            <span className="font-medium">
              {formatDateTime(order?.created_at ?? "", i18n.language)}
            </span>
          </div>
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-center ">
            <Badge className={statusClass}>{statusText}</Badge>
          </div>
          <p className="text-sm font-medium my-2 text-foreground/80 line-clamp-2 min-h-4 max-h-10">
            {order.description}
          </p>
          <div className="flex items-start my-4 gap-4 overflow-hidden">
            <div className="space-y-1.5 flex-1">
              <h3 className="flex relative flex-col items-start text-md font-bold tracking-tight text-foreground truncate">
                <div className="flex items-center gap-2">
                  <span className="bg-neutral-500/15 text-neutral-500 rounded-full size-8 flex items-center justify-center">
                    <MapPin className="size-4" />
                  </span>
                  <span className=" flex flex-col truncate max-w-[260px]">
                    <span className="text-sm font-medium text-neutral-500">
                      {t("shipments.form.origin.label")}
                    </span>
                    {getLocalizedName(order?.origin, i18n.language)}
                  </span>
                </div>
                <div className="min-h-4 bg-input w-0.5 mx-4 my-1"></div>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="bg-emerald-500/15 text-emerald-500 rounded-full size-8 flex items-center justify-center">
                    <MapPin className="size-4" />
                  </span>
                  <span className=" flex flex-col truncate max-w-[260px]">
                    <span className="text-xs font-bold text-emerald-500">
                      {t("shipments.form.destination.label")}
                    </span>
                    {getLocalizedName(order?.destination, i18n.language)}
                  </span>
                </div>
              </h3>
            </div>
          </div>
          <div className=" flex items-center my-2 font-medium gap-2 text-foreground/90">
            <span className="text-sm">
              {t("shipments.form.summary.available_between")} :
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
        </div>
        <div className="flex items-center justify-end py-2 px-4 border-t border-border gap-2">
          <Button
            onClick={() => {
              setOrderId(order.id);
              toggleOrder();
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1 h-8 rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95"
          >
            <Eye className="size-4" />
            {t("global.actions.view")}
          </Button>
          {order.status !== "pending" && (
            <Button
              onClick={() => {
                setOrderId(order.id);
                toggleOffers();
              }}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium gap-1 h-8 rounded-lg shadow-md shadow-secondary/20 transition-all active:scale-95"
            >
              <HandCoins className="size-4" />
              {t("global.actions.view_offers")}
            </Button>
          )}
        </div>
      </CardContent>
      {orderId && (
        <OrderView id={orderId} isOpen={isOrder} onOpenChange={toggleOrder} />
      )}
      {orderId && (
        <OrderOffersView
          orderId={orderId}
          isOpen={isOffers}
          onOpenChange={toggleOffers}
        />
      )}
    </Card>
  );
};

export const ShipperOrderCard: React.FC<BaseOrderCardProps> = ({
  order,
  className,
}) => {
  const { t, i18n } = useTranslation();
  const { isOpen: isOrder, toggle: toggleOrder } = useDisclosure();
  const [orderId, setOrderId] = React.useState<string | null>(null);

  const shipperOffer = order.my_offer!;

  const bgClass = shipperOffer
    ? offerBackgroundColors[shipperOffer.status]
    : "bg-blue-500 text-blue-600";

  const statusClass = offerStatusColors[shipperOffer.status]

  const statusText = t(`global.status.${shipperOffer?.status}`)


  return (
    <Card
      className={cn(
        "group overflow-hidden border-border/60 py-0 rounded-2xl bg-card h-full flex flex-col",
        className,
      )}
    >
      <CardContent className="p-0 flex-1 flex flex-col">
        <div
          className={cn(
            "min-h-36 relative flex items-center justify-center text-xl font-semibold",
            bgClass,
          )}
        >
          {order.category && (
            <div className="flex flex-col items-center mb-4 ">
              {order.category.icon_name && (
                <DynamicIcon
                  name={order.category.icon_name}
                  className="size-12 text-white"
                  strokeWidth={2}
                />
              )}
              <span className="text-white text-2xl font-medium">
                {getLocalizedName(order.category, i18n.language)}
              </span>
            </div>
          )}
          <div className="text-white text-sm flex items-center gap-1 absolute bottom-1 rtl:right-2 ltr:left-2 px-3 py-1 rounded-md bg-white/10 ">
            <span className="font-medium flex items-center gap-0.5">
              <Calendar1 className="size-4" /> {t("global.created_at")}
            </span>
            <span className="font-medium">
              {formatDateTime(order?.created_at ?? "", i18n.language)}
            </span>
          </div>
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-center ">
            <Badge className={statusClass}>{statusText}</Badge>
          </div>
          <p className="text-sm font-medium my-2 text-foreground/80 line-clamp-2 min-h-4 max-h-10">
            {order.description}
          </p>
          <div className="flex items-start my-4 gap-4 overflow-hidden">
            <div className="space-y-1.5 flex-1">
              <h3 className="flex relative flex-col items-start text-md font-bold tracking-tight text-foreground truncate">
                <div className="flex items-center gap-2">
                  <span className="bg-neutral-500/15 text-neutral-500 rounded-full size-8 flex items-center justify-center">
                    <MapPin className="size-4" />
                  </span>
                  <span className=" flex flex-col truncate max-w-[260px]">
                    <span className="text-sm font-medium text-neutral-500">
                      {t("shipments.form.origin.label")}
                    </span>
                    {getLocalizedName(order?.origin, i18n.language)}
                  </span>
                </div>
                <div className="min-h-4 bg-input w-0.5 mx-4 my-1"></div>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="bg-emerald-500/15 text-emerald-500 rounded-full size-8 flex items-center justify-center">
                    <MapPin className="size-4" />
                  </span>
                  <span className=" flex flex-col truncate max-w-[260px]">
                    <span className="text-xs font-bold text-emerald-500">
                      {t("shipments.form.destination.label")}
                    </span>
                    {getLocalizedName(order?.destination, i18n.language)}
                  </span>
                </div>
              </h3>
            </div>
          </div>
          <div className=" flex items-center my-2 font-medium gap-2 text-foreground/90">
            <span className="text-sm">
              {t("shipments.form.summary.available_between")} :
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
        </div>
        <div className="flex items-center justify-end py-2 px-4 border-t border-border gap-2">
          <Button
            onClick={() => {
              setOrderId(order.id);
              toggleOrder();
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1 h-8 rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95"
          >
            <Eye className="size-4" />
            {t("global.actions.view")}
          </Button>
        </div>
      </CardContent>
      {orderId && (
        <OrderView id={orderId} isOpen={isOrder} onOpenChange={toggleOrder} />
      )}
    </Card>
  );
};

interface OrderCardProps {
  order?: ShipmentOrder;
  isLoading?: boolean;
  className?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isLoading,
  className,
}) => {
  const { hasRole } = useAuthorization();

  if (isLoading || !order) {
    return <OrderCardSkeleton />;
  }

  if (hasRole({ role: "shipper" })) {
    return <ShipperOrderCard order={order} className={className} />;
  }

  return <ClientOrderCard order={order} className={className} />;
};

