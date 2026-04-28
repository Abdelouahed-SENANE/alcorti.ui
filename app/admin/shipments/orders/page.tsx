"use client";

import { DashLayout } from "@/components/layouts/dashboard/_dash.layout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useQueryTable } from "@/components/ui/table";
import { paths } from "@/config/paths";
import {
  AdminOrderParams,
  useAdminOrders,
} from "@/features/shipments/api/orders/admin.orders";
import { OrderFilters } from "@/features/shipments/components/orders/order.filters";
import { OrderTable } from "@/features/shipments/components/orders/order.table";
import { ShipmentOrderSummary } from "@/features/shipments/shipment.type";
import { Download } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function OrdersPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const table = useQueryTable<ShipmentOrderSummary, AdminOrderParams>();

  const ordersQuery = useAdminOrders({
    params: {
      page: table.page,
      limit: table.limit,
      sort: table.sort as any,
      order: table.order,
      ...table.filters,
    },
  });

  const items = ordersQuery.data?.data?.items || [];
  const pagination = ordersQuery.data?.data?.pagination;


  return (
    <DashLayout
      title={t("shipments.orders.page.title")}
      desc={t("shipments.orders.page.desc")}
      breadcrumbs={[
        {
          label: t("navigation.dashboard"),
          url: paths.admin.dashboard.route(),
          active: false,
        },
        {
          label: t("navigation.shipments.orders"),
          url: paths.admin.shipments.orders.route(),
          active: true,
        },
      ]}
      actions={
        <div className="flex items-center gap-1">
          <Button className="gap-1 " variant={"secondary"}>
            <Download className="size-4" />
            {t("shipments.orders.actions.export")}
          </Button>
        </div>
      }
    >
      <OrderFilters
        initialFilters={table.filters}
        onFilter={table.setFilters}
        alwaysOpen={true}
        className="mb-4"
      />
      <OrderTable
        orders={items}
        isFetching={ordersQuery.isFetching}
        table={table}
        pagination={pagination}
      />
    </DashLayout>
  );
}
