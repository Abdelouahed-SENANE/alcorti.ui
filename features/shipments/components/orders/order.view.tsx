"use client";

import { Badge } from "@/components/ui/badge";
import { DynamicIcon } from "@/components/ui/icons/dynamic-icon";
import { Spinner } from "@/components/ui/spinner";
import { DistanceViewer } from "@/components/viewers/distance/distance-viewer";
import i18n from "@/config/i18n";
import {
  cn,
  formatDate,
  formatDateTime,
  resolveLocaleValue,
} from "@/lib/utils";
import { calculatePrice, calculateRoadDistance, RouteResult } from "@/services";
import {
  Calendar,
  MapPin,
  Navigation,
  Package,
  Route,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOrderDetails } from "../../api/orders/details.order";
import {
  OrderStatus,
  ShipmentOrderItem,
  ShipmentOrderTimeline,
} from "../../shipment.type";
import { OrderDrawer } from "../common/order.drawer";

interface OrderViewProps {
  id: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderView = ({ id, isOpen, onOpenChange }: OrderViewProps) => {
  const { t } = useTranslation();
  const lang = i18n.language;

  const orderQuery = useOrderDetails({ id });

  const order = orderQuery.data?.data;

  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (order) {
      calculateRoadDistance(
        { lat: order.origin.lat, lng: order.origin.lng },
        { lat: order.destination.lat, lng: order.destination.lng },
      ).then((result: RouteResult | null) => {
        if (result) {
          setDistance(result.distanceKm);
        }
      });
    }
  }, [order]);

  const getLocalizedName = (obj: any) => {
    if (!obj) return "";
    const locale =
      i18n.language === "ar" ? "ar" : i18n.language === "fr" ? "fr" : "en";
    return (
      obj[`name_${locale}`] || obj.name_en || obj.name_ar || obj.name_fr || ""
    );
  };
  if (!order) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center dark:bg-black/60 bg-white/60 ">
        <div className="flex items-center gap-2">
          <Spinner size="sm" variant="primary" />
          <p className="text-sm font-medium dark:text-white text-black">
            {t("global.loading")}
          </p>
        </div>
      </div>
    );
  }

  const categoryName = resolveLocaleValue(order.category, lang);
  const originName = resolveLocaleValue(order.origin, lang);
  const destinationName = resolveLocaleValue(order.destination, lang);

  return (
    <OrderDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={t("shipments.orders.detail.title", "Order Details")}
    >
      <div className="space-y-4 pb-8">
        <div className="p-4 rounded-xl bg-secondary text-secondary-foreground  border border-primary/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-background/20 backdrop-blur-md flex items-center justify-center text-primary shadow-inner">
                <Wallet className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-secondary-foreground/60 leading-none mb-1">
                  {t("shipments.form.summary.estimated_price")}
                </p>
                <p className="text-xs font-medium text-secondary-foreground/40">
                  {t("shipments.form.summary.confirmation_notice")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-primary tracking-tighter">
                  {calculatePrice(distance!)}
                </span>
                <span className="text-[10px] font-black text-primary/80 uppercase tracking-widest">
                  {t("shipments.form.summary.mad")}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Header Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {order.category?.icon_name && (
                <Badge variant={"default"} className="font-bold text-xs">
                  <DynamicIcon
                    name={order.category.icon_name}
                    className="size-5"
                  />
                  {categoryName}
                </Badge>
              )}
            </div>
            <Badge className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border-primary/20">
              {t(`shipments.orders.status.${order.status}`)}
            </Badge>
          </div>
          <p className="text-sm text-foreground/70 font-medium leading-relaxed text-pretty ">
            {order.description || t("global.no_description")}
          </p>
        </div>

        {/* Timeline / Dates */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-0.5 text-base  font-semibold">
            <Calendar className="size-5 text-primary " />
            {t("shipments.form.summary.available_between")}
          </span>
          <p className="text-base font-medium text-primary">
            {formatDate(order.from_date, lang)} -{" "}
            {formatDate(order.to_date, lang)}
          </p>
        </div>

        {/* Route & Map */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-base font-semibold text-foreground">
            <div className="flex items-center gap-2">
              <Route className="size-5 text-primary" />
              {t("shipments.form.summary.route")}
            </div>
            <div className="px-2 py-1 bg-primary flex items-center gap-1  text-primary-foreground rounded-md text-sm medium border border-primary/20">
              <Navigation className="size-4" />
              {distance} {t("global.km")}
            </div>
          </div>

          <div className="relative space-y-2 ">
            <div className="space-y-1.5 flex-1">
              <h3 className="flex relative flex-col items-start text-md font-bold tracking-tight text-foreground truncate">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/15 text-primary rounded-full size-8 flex items-center justify-center">
                    <MapPin className="size-4" />
                  </span>
                  <span className="truncate flex flex-col max-w-[260px]">
                    <span className="text-xs text-foreground/70 font-bold">
                      {t("shipments.form.origin.label")}
                    </span>
                    {resolveLocaleValue(order?.origin, lang)}
                  </span>
                </div>

                <div className="min-h-4 bg-input w-0.5 mx-4 my-1"></div>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="bg-primary/15 text-primary rounded-full size-8 flex items-center justify-center">
                    <MapPin className="size-4" />
                  </span>
                  <span className="truncate flex flex-col max-w-[260px]">
                    <span className="text-xs text-foreground/70 font-bold">
                      {t("shipments.form.destination.label")}
                    </span>
                    {resolveLocaleValue(order?.destination, lang)}
                  </span>
                </div>
              </h3>
            </div>

            <div className="h-[250px] rounded-xl overflow-hidden border border-border/60 shadow-inner">
              <DistanceViewer
                origin={{
                  lat: order.origin.lat,
                  lng: order.origin.lng,
                  label: originName,
                }}
                destination={{
                  lat: order.destination.lat,
                  lng: order.destination.lng,
                  label: destinationName,
                }}
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Package className="size-5 text-primary" />
              {t("shipments.form.items.label")}
            </div>
            <Badge variant="secondary" className="font-black">
              {order.items.length} {t("global.count")}
            </Badge>
          </div>

          <div className="grid gap-3">
            {order.items.map((item, index) => (
              <ItemRow key={index} item={item} t={t} />
            ))}
          </div>
        </div>

        {/* Timelines Section */}
        <div className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Package className="size-5 text-primary" />
              {t("shipments.orders.timelines.title")}
            </div>
          </div>

          <div className="relative space-y-0 ">
            {order.timelines.map((timeline, index) => (
              <TimelineItem
                key={index}
                timeline={timeline}
                isLast={index === order.timelines.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Final Price Estimation */}
      </div>
    </OrderDrawer>
  );
};

const ItemRow = ({ item, t }: { item: ShipmentOrderItem; t: any }) => {
  return (
    <div className="group flex items-start justify-between rounded-lg p-2  bg-primary/2 border border-primary/20">
      <div className="flex items-center gap-2">
        {item.image_url ? (
          <div className="relative size-8 rounded-lg overflow-hidden bg-muted border border-border shadow-sm shrink-0">
            <Image
              src={item.image_url}
              alt={item?.description || "Item image"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : (
          <div className="size-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0">
            <Package className="size-5 opacity-60" />
          </div>
        )}
        <div className="flex flex-col gap-0.5 py-0.5">
          <span className="text-foreground font-semibold tracking-tight text-sm line-clamp-1 max-w-[200px] md:max-w-md">
            {item.description || "-"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {item.weight && (
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/10 uppercase tracking-wider">
              {t("shipments.form.items.weight_summary", {
                weight: item.weight,
              })}
            </span>
          )}
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/10 uppercase tracking-wider">
            {t("shipments.form.items.dims_summary", {
              length: item.length,
              width: item.width,
              height: item.height,
            })}
          </span>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/10 uppercase tracking-wider">
            {t("shipments.form.items.volume.display", {
              volume: Math.round(item.volume * 100) / 100,
              unit: item.unit,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({
  timeline,
  isLast,
}: {
  timeline: ShipmentOrderTimeline;
  isLast: boolean;
}) => {
  const { t } = useTranslation();

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

  return (
    <div className="relative flex gap-x-4 p-2">
      {/* Visual Line and Circle */}
      <div
        className={cn(
          "relative flex flex-col items-center",
          !isLast &&
            "after:absolute after:top-[10px] after:bottom-[-26px] after:w-0.5 after:bg-primary/20",
        )}
      >
        <div className="relative z-10 size-5 flex items-center justify-center rounded-full bg-background border-2 border-primary shadow-sm shadow-primary/20">
          <div className="size-1.5 rounded-full bg-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-7 ">
        <h5 className="font-bold  text-foreground flex items-center gap-2  tracking-tight leading-none">
          <Badge
            variant="outline"
            className={statusVariants[timeline.new_status]}
          >
            {t(`shipments.orders.status.${timeline.new_status}`)}
          </Badge>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/10 tracking-widest">
            {formatDateTime(timeline.created_at, i18n.language)}
          </span>
        </h5>
      </div>
    </div>
  );
};
