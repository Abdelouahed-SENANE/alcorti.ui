"use client";

import { useAutocompleteCache } from "@/components/ui/autocomplete/autocomplete.cache";
import i18n from "@/config/i18n";
import { CategoryOption } from "@/features/categories/category.type";
import { LocationOption } from "@/features/locations/location.type";
import { ShipmentOrderInputs } from "@/features/shipments/api/orders/create.order";
import { formatDate, resolveLocaleValue } from "@/lib/utils";
import { calculateDistance, calculatePrice } from "@/services";
import {
  Calendar,
  FileText,
  Layers,
  Package,
  Route,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Control, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DistanceViewer } from "../../../../../components/viewers/distance/distance-viewer";

interface SummaryStepProps {
  control: Control<ShipmentOrderInputs>;
}

export const SummaryStep = ({ control }: SummaryStepProps) => {
  const { t } = useTranslation();
  const formValues = useWatch({ control });
  const lang = i18n.language;

  // Resolve Category Meta
  const { selectedLabel: categoryName } = useAutocompleteCache({
    cacheKey: "categories",
    value: formValues.category_id,
    itemToValue: (v: CategoryOption) => v.id,
    itemToLabel: (v: CategoryOption) => resolveLocaleValue(v, lang),
  });

  // Resolve Origin Meta
  const { selectedLabel: originName, selectedItem: originItem } =
    useAutocompleteCache<LocationOption>({
      cacheKey: "locations",
      value: formValues.origin_id,
      itemToValue: (v: LocationOption) => v.value,
      itemToLabel: (v: LocationOption) => resolveLocaleValue(v, lang),
    });

  // Resolve Destination Meta
  const { selectedLabel: destinationName, selectedItem: destinationItem } =
    useAutocompleteCache<LocationOption>({
      cacheKey: "locations",
      value: formValues.destination_id,
      itemToValue: (v: LocationOption) => v.value,
      itemToLabel: (v: LocationOption) => resolveLocaleValue(v, lang),
    });
  const distance = calculateDistance(
    originItem?.lat!,
    originItem?.lng!,
    destinationItem?.lat!,
    destinationItem?.lng!,
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div className="text-base font-semibold flex items-center gap-2 leading-relaxed text-foreground/90 uppercase tracking-tight">
            <FileText className="size-5 shrink-0 text-primary" />
            {t("shipments.form.description.label")}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
            <Layers className="size-4" />
            {categoryName || formValues.category_id || "-"}
          </div>
        </div>
        <div className="flex items-start gap-2 text-foreground/70 text-sm font-medium leading-relaxed max-w-2xl">
          <p>{formValues.description || "-"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="inline-flex items-center gap-2 text-base font-bold tracking-tight text-foreground/80 uppercase">
          <Calendar className="size-5 text-primary" />
          {t("shipments.form.summary.available_between")}
        </p>
        <div className="flex items-center gap-3 px-1">
          <div className="text-md font-black text-foreground">
            {formatDate(formValues.from_date || "", lang)}
          </div>
          <span className="text-muted-foreground/30 font-bold px-2">→</span>
          <div className="text-md font-black text-foreground">
            {formatDate(formValues.to_date || "", lang)}
          </div>
        </div>
      </div>

      {/* Route Visualization Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-foreground">
          <Route className="size-5 text-primary" />
          {t("shipments.form.summary.route")}
        </div>
        <div className="flex items-center justify-between relative p-4 rounded-2xl bg-primary/2 border border-primary/20">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-black leading-none text-foreground">
              {originItem?.[`name_${lang}` as keyof LocationOption] ||
                formValues.origin_id ||
                "-"}
            </span>
          </div>

          <div className="flex-1 mx-8 relative flex items-center justify-center">
            <div className="w-full h-px bg-border/60 relative">
              <div className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-border rotate-45 rtl:-rotate-135" />
            </div>
            <div className="absolute px-3 py-1 bg-primary rounded-full border border-primary/20 text-[10px] font-black tracking-wider text-primary-foreground shadow-lg shadow-primary/20">
              {distance} {t("global.km")}
            </div>
          </div>

          <div className="flex flex-col gap-1 text-right">
            <span className="text-sm font-black leading-none text-foreground">
              {destinationItem?.[`name_${lang}` as keyof LocationOption] ||
                formValues.destination_id ||
                "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
        {originItem?.lat &&
        originItem?.lng &&
        destinationItem?.lat &&
        destinationItem?.lng ? (
          <DistanceViewer
            origin={{
              lat: originItem.lat,
              lng: originItem.lng,
              label: originName,
            }}
            destination={{
              lat: destinationItem.lat,
              lng: destinationItem.lng,
              label: destinationName,
            }}
          />
        ) : (
          <div className="aspect-video flex items-center justify-center bg-muted/20 text-muted-foreground/40 text-sm font-medium">
            {t("shipments.form.summary.map_waiting_coords")}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 ">
          <div className=" text-base font-bold text-foreground">
            {t("shipments.form.items.label")}
          </div>
          <div className="inline-flex px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary">
            {t("global.items_count", {
              count: formValues.items?.length || 0,
            })}
          </div>
        </div>
        <div className="space-y-2">
          {formValues.items?.map((item, index) => (
            <ItemRow key={index} item={item} lang={lang} t={t} />
          ))}
        </div>
      </div>
      {/* Price Estimation Section */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary text-secondary-foreground shadow-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="size-12 rounded-2xl bg-background/10 backdrop-blur-md flex items-center justify-center text-primary shadow-inner border border-background/20">
            <Wallet className="size-6" />
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight uppercase leading-none mb-1">
              {t("shipments.form.summary.estimated_price")}
            </p>
            <p className="text-xs text-secondary-foreground/60 font-bold max-w-[180px] md:max-w-none">
              {t("shipments.form.summary.confirmation_notice")}
            </p>
          </div>
        </div>
        <div className="text-right relative z-10">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-primary tracking-tighter">
              {calculatePrice(distance)}
            </span>
            <span className="text-[10px] font-black text-primary/80 uppercase tracking-widest">
              {t("shipments.form.summary.mad")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemRow = ({ item, lang, t }: { item: any; lang: string; t: any }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (item.image instanceof File) {
      const url = URL.createObjectURL(item.image);
      setImgUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    return () => {};
  }, [item.image]);

  return (
    <div className="group flex items-start justify-between rounded-lg p-2  bg-primary/2 border border-primary/20">
      <div className="flex items-start gap-2">
        {imgUrl ? (
          <div className="relative size-12 rounded-lg overflow-hidden bg-muted border border-border shadow-sm shrink-0">
            <Image
              src={imgUrl}
              alt={item?.description || "Item image"}
              fill
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
          <div className="flex items-center gap-2">
            {item.is_weight && (
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
          </div>
        </div>
      </div>
    </div>
  );
};
