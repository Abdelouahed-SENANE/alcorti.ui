"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useMyOrders,
  type MyOrdersParams,
} from "@/features/shipments/api/orders/my.orders";
import { OrderCard } from "@/features/shipments/components/orders/order.card";
import { OrderFilters } from "@/features/shipments/components/orders/order.filters";
import { ShipmentOrder } from "@/features/shipments/shipment.type";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function OrdersPage() {
  const { t } = useTranslation();
  const [params, setParams] = React.useState<Omit<MyOrdersParams, "cursor">>(
    {},
  );
  const router = useRouter();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyOrders({
    params,
  });
  console.log(data?.pages.flatMap((page) => page.data?.items));
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className="container relative mx-auto py-6 space-y-6 animate-in fade-in duration-500">
        <OrderFilters onFilter={setParams} />

        <div className="flex flex-col gap-4">
          {data?.pages.map((page, i) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              key={i}
            >
              {page.data?.items.map((order: ShipmentOrder) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ))}

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-48 animate-pulse bg-muted/50" />
              ))}
            </div>
          )}

          {!isLoading && data?.pages[0].data?.items.length === 0 && (
            <Card className="rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center gap-4">
              <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center">
                <div className="size-2 rounded-full bg-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">
                  {t("shipments:orders.messages.empty")}
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <Button
                  onClick={() => router.push("/client/shipments/orders/new")}
                  className=" rounded-full"
                  size="icon"
                >
                  <Plus />
                </Button>
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
                {isFetchingNextPage
                  ? t("global.loading")
                  : t("global.load_more")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </React.Suspense>
  );
}
