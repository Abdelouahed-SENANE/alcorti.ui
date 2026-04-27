"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOngoingOffers } from "@/features/shipments/api/offers/ongoing.offers";
import {
  OfferCard,
  OfferCardSkeleton,
} from "@/features/shipments/components/offers/offer.card";
import {
  OfferFilters,
  OfferFiltersState,
} from "@/features/shipments/components/offers/offer.filters";
import { OfferStatus, ShipmentOffer } from "@/features/shipments/shipment.type";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function OngoingOffersPage() {
  const { t } = useTranslation();
  const [params, setParams] = React.useState<OfferFiltersState>({});
  const [status, setStatus] = React.useState<OfferStatus | "all">("all");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useOngoingOffers({
      params: {
        ...params,
        status,
      },
    });

  const statusOptions: { label: string; value: OfferStatus | "all" }[] = [
    { label: t("global.all"), value: "all" },
    { label: t("global.status.pending"), value: "pending" },
    { label: t("global.status.accepted"), value: "accepted" },
    { label: t("global.status.cancelled"), value: "cancelled" },
  ];

  return (
    <div className="container relative mx-auto py-6 space-y-6 ">
      <div className="space-y-4">
        <OfferFilters
          onFilter={setParams}
          titleSection={
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {t("shipments.orders.page.ongoing_offers.title")}
              </h1>
              <p className="text-foreground/60 ">
                {t("shipments.orders.page.ongoing_offers.desc")}
              </p>
            </div>
          }
        />

        <div className="flex gap-2">
          {statusOptions.map((opt) => (
            <Button
              key={opt.value}
              variant="plain"
              onClick={() => setStatus(opt.value)}
              className={cn(
                "bg-card text-card-foreground border border-border  hover:bg-primary/90 hover:text-primary-foreground",
                status === opt.value && "bg-primary/90 text-primary-foreground!",
              )}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <OfferCardSkeleton key={i} />
            ))}
          </div>
        )}

        {data?.pages.map((page, i) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            key={i}
          >
            {page.data?.items.map((offer: ShipmentOffer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ))}

        {!isLoading && data?.pages[0].data?.items.length === 0 && (
          <Card className="rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center gap-4">
            <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center">
              <div className="size-2 rounded-full bg-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">
                {t("shipments.orders.messages.empty")}
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {t("shipments.orders.messages.empty_description")}
              </p>
            </div>
          </Card>
        )}

        {hasNextPage && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? t("global.loading") : t("global.load_more")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
