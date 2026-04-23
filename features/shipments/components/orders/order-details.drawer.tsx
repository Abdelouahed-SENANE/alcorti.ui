"use client";

import { Badge } from "@/components/ui/badge";
import { DistanceViewer } from "@/components/viewers/distance/distance-viewer";
import i18n from "@/config/i18n";
import { formatDate, resolveLocaleValue } from "@/lib/utils";
import { calculateDistance, calculatePrice } from "@/services";
import { Calendar, FileText, Package, Route, Wallet } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ShipmentOrder, ShipmentOrderItem } from "../../shipment.type";

interface OrderDetailsProps {
  order: ShipmentOrder;
}

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  const { t } = useTranslation();
  const lang = i18n.language;

  const categoryName = resolveLocaleValue(order.category, lang);
  const originName = resolveLocaleValue(order.origin, lang);
  const destinationName = resolveLocaleValue(order.destination, lang);

  const distance =
    order.distance ||
    calculateDistance(
      order.origin.lat,
      order.origin.lng,
      order.destination.lat,
      order.destination.lng,
    );

  return (
    <div className="space-y-8 pb-8">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider leading-none">
                {t("global.description")}
              </h4>
              <p className="text-lg font-bold text-foreground">
                {categoryName}
              </p>
            </div>
          </div>
          <Badge className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border-primary/20">
            {t(`shipments.orders.status.${order.status}`)}
          </Badge>
        </div>
        <p className="text-base text-foreground/80 leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/50">
          {order.description || t("global.no_description")}
        </p>
      </div>

      {/* Timeline / Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border/60 p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Calendar className="size-3.5" />
            {t("shipments.form.available_from.label")}
          </div>
          <p className="text-lg font-black text-foreground">
            {formatDate(order.from_date, lang)}
          </p>
        </div>
        <div className="bg-card border border-border/60 p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Calendar className="size-3.5" />
            {t("shipments.form.available_to.label")}
          </div>
          <p className="text-lg font-black text-foreground">
            {formatDate(order.to_date, lang)}
          </p>
        </div>
      </div>

      {/* Route & Map */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Route className="size-5 text-primary" />
          {t("shipments.form.summary.route")}
        </div>

        <div className="relative p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-6">
          <div className="flex items-center justify-between relative">
            <div className="flex flex-col gap-1 z-10 bg-transparent">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                {t("shipments.orders.filters.origin")}
              </span>
              <span className="text-sm font-black text-foreground max-w-[120px]">
                {originName}
              </span>
            </div>

            <div className="flex-1 mx-4 relative flex items-center justify-center">
              <div className="w-full h-px bg-primary/20 border-t border-dashed border-primary/40 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-primary/40 rotate-45" />
              </div>
              <div className="absolute px-3 py-1 bg-primary text-white rounded-full text-[10px] font-black tracking-wider shadow-lg shadow-primary/20">
                {distance} {t("global.km")}
              </div>
            </div>

            <div className="flex flex-col gap-1 text-right z-10 bg-transparent">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                {t("shipments.orders.filters.destination")}
              </span>
              <span className="text-sm font-black text-foreground max-w-[120px]">
                {destinationName}
              </span>
            </div>
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
      <div className="space-y-4">
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
            <OrderDetailItem key={index} item={item} />
          ))}
        </div>
      </div>

      {/* Final Price Estimation */}
      <div className="p-6 rounded-2xl bg-secondary text-secondary-foreground shadow-xl border border-secondary/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-background/20 backdrop-blur-md flex items-center justify-center text-primary shadow-inner">
              <Wallet className="size-6" />
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
                {calculatePrice(distance)}
              </span>
              <span className="text-[10px] font-black text-primary/80 uppercase tracking-widest">
                {t("shipments.form.summary.mad")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailItem = ({ item }: { item: ShipmentOrderItem }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors shadow-sm group">
      <div className="size-14 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 overflow-hidden relative">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.description}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <Package className="size-6 opacity-40" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="font-bold text-foreground text-sm truncate uppercase tracking-tight">
          {item.description}
        </h5>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/5 uppercase">
            {item.length}x{item.width}x{item.height} {item.unit}
          </span>
          {item.weight > 0 && (
            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/5 uppercase">
              {item.weight} {t("global.kg")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
