"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBookingOrders } from "@/features/shipments/api/orders/booking.orders";
import { ClientOrdersParams } from "@/features/shipments/api/orders/client.orders";
import {
  OrderCardSkeleton,
  ShipperOrderCard,
} from "@/features/shipments/components/orders/order.card";
import { OrderFilters } from "@/features/shipments/components/orders/order.filters";
import { ShipmentOrder } from "@/features/shipments/shipment.type";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function OrdersPage() {
  const { t } = useTranslation();
  const [params, setParams] = React.useState<
    Omit<ClientOrdersParams, "cursor">
  >({});

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBookingOrders({
      params,
    });

  return (
    <div className="container relative mx-auto py-6 space-y-6 ">
      <OrderFilters
        onFilter={setParams}
        titleSection={
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("shipments.orders.page.booking.title")}
            </h1>
            <p className="text-foreground/60 ">
              {t("shipments.orders.page.booking.desc")}
            </p>
          </div>
        }
      />

      <div className="flex flex-col gap-4">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        )}

        {data?.pages.map((page, i) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            key={i}
          >
            {page.data?.items.map((order: ShipmentOrder) => (
              <ShipperOrderCard key={order.id} order={order} />
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
