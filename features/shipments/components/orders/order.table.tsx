"use client";
import { Badge } from "@/components/ui/badge";
import { QuickAction, QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import { useQueryTable } from "@/components/ui/table/use-query-table";
import i18n from "@/config/i18n";
import { paths } from "@/config/paths";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatDateTime } from "@/lib/utils";
import { Lang, Pagination } from "@/types/api";
import { CheckCircle, Eye, Send, XCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ShipmentOrderSummary } from "../../shipment.type";

const OrderView = dynamic(
  () => import("./order.view").then((mod) => mod.OrderView),
  { ssr: false },
);

interface OrderTableProps {
  orders: ShipmentOrderSummary[];
  table: ReturnType<typeof useQueryTable<ShipmentOrderSummary>>;
  pagination?: Pagination;
  isFetching?: boolean;
}

export const OrderTable = ({
  orders,
  table,
  pagination,
  isFetching,
}: OrderTableProps) => {
  const { t } = useTranslation();
  const lang = i18n.language as Lang;
  const { isOpen, toggle } = useDisclosure();
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleAction = useCallback(
    (action: string, order: ShipmentOrderSummary) => {
      switch (action) {
        case "view":
          setOrderId(order.id);
          toggle();
          break;
        default:
          break;
      }
    },
    [toggle],
  );

  const ACTIONS = useMemo<QuickAction<ShipmentOrderSummary>[]>(
    () => [
      {
        label: t("global.actions.view"),
        value: "view",
        icon: <Eye className="h-4 w-4" />,
      },
    ],
    [t],
  );

  const columns = useMemo<TableColumn<ShipmentOrderSummary>[]>(
    () => [
      {
        title: t("shipments.orders.columns.description", "Description"),
        field: "description",
        Cell: ({ entry: { description } }) => (
          <span className="max-w-[200px] truncate block font-medium">
            {description}
          </span>
        ),
      },
      {
        title: t("shipments.orders.columns.category", "Category"),
        field: "category",
        Cell: ({ entry: { category } }) => (
          <span>{category?.name_fr || "-"}</span>
        ),
      },
      {
        title: t("shipments.orders.columns.origin", "Origin"),
        field: "origin",
        Cell: ({ entry: { origin } }) => <span>{origin?.name_fr || "-"}</span>,
      },
      {
        title: t("shipments.orders.columns.destination", "Destination"),
        field: "destination",
        Cell: ({ entry: { destination } }) => (
          <span>{destination?.name_fr || "-"}</span>
        ),
      },
      {
        title: t("shipments.orders.columns.status", "Status"),
        field: "status",
        sortable: true,
        Cell: ({ entry: { status } }) => (
          <Badge variant={status === "published" ? "default" : "secondary"}>
            {t(`shipments.orders.status.${status}`)}
          </Badge>
        ),
      },
      {
        title: t("shipments.orders.columns.amount", "Amount"),
        field: "total_amount",
        sortable: true,
        Cell: ({ entry: { total_amount } }) => (
          <span className="font-semibold text-primary">{total_amount} MAD</span>
        ),
      },
      {
        title: t("shipments.orders.columns.created_at", "Created At"),
        field: "created_at",
        sortable: true,
        Cell: ({ entry: { created_at } }) => (
          <div className="text-muted-foreground">
            {formatDateTime(created_at || "", lang) || "-"}
          </div>
        ),
      },
      {
        title: t("global.actions.title", "Actions"),
        field: "id",
        Cell: ({ entry }) => (
          <QuickActions
            entity={entry}
            id={entry.id!}
            actions={ACTIONS}
            onAction={(action) => handleAction(action as string, entry)}
          />
        ),
      },
    ],
    [t, lang, handleAction, ACTIONS],
  );

  return (
    <>
      <Table<ShipmentOrderSummary>
        data={orders}
        columns={columns}
        isLoading={isFetching}
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(orders.map((r) => r.id!))}
        sort={table.sort}
        onSortChange={table.setSorting}
        order={table.order}
        emptyMessage={t("shipments.orders.messages.empty", "No orders found")}
        pagination={{
          page: table.page,
          limit: table.limit,
          total: pagination?.total!,
          rootUrl: paths.admin.shipments.orders.route(),
        }}
      />
      {orderId && (
        <OrderView id={orderId} isOpen={isOpen} onOpenChange={toggle} />
      )}
    </>
  );
};
