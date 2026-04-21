import { QuickAction, QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import { useQueryTable } from "@/components/ui/table/use-query-table";
import { toast } from "@/components/ui/toast/use-toast";
import i18n from "@/config/i18n";
import { paths } from "@/config/paths";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatDateTime } from "@/lib/utils";
import { ApiResponse, Lang, Pagination } from "@/types/api";
import { Edit, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { UpdateVehicleInputs, useUpdateVehicle } from "../api/update.vehicle";
import { Vehicle } from "../vehicle.type";
import { VehicleDeleteDialog } from "./vehicle.delete-dialog";
import { VehicleForm } from "./vehicle.form";
// import { ClientTableSkeleton } from "./skeletons/client.table-skeleton";
interface VehicleTableProps {
  vehicles: Vehicle[];
  table: ReturnType<typeof useQueryTable<Vehicle>>;
  pagination?: Pagination;
  isFetching?: boolean;
}
export const VehicleTable = ({
  vehicles,
  table,
  pagination,
  isFetching,
}: VehicleTableProps) => {
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState<Vehicle | undefined>(undefined);
  const { isOpen: isEdit, open: openEdit, close: closeEdit } = useDisclosure();
  const {
    isOpen: isDelete,
    open: openDelete,
    close: closeDelete,
  } = useDisclosure();
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateVehicleInputs, string[]>>
  >({});
  const lang = i18n.language as Lang;

  const handleAction = useCallback(
    (action: string, vehicle: Vehicle) => {
      switch (action) {
        case "delete":
          setVehicle(vehicle);
          openDelete();
          break;
        case "edit":
          setVehicle(vehicle);
          openEdit();
          break;
        default:
          break;
      }
    },
    [openDelete, openEdit],
  );

  const ACTIONS: QuickAction[] = [
    {
      label: t("vehicles.actions.edit"),
      value: "edit",
      icon: <Edit className="h-4 w-4 text-foreground" />,
    },
    {
      label: t("vehicles.actions.delete"),
      value: "delete",
      icon: <Trash className="h-4 w-4 text-foreground" />,
    },
  ];

  const columns = useMemo<TableColumn<Vehicle>[]>(
    () => [
      {
        title: t("vehicles.columns.brand"),
        field: "brand",
        sortable: true,
        Cell: ({ entry: { brand } }) => <span>{brand}</span>,
      },
      {
        title: t("vehicles.columns.model"),
        field: "model",
        sortable: true,
        Cell: ({ entry: { model } }) => <div>{model || "-"}</div>,
      },
      {
        title: t("vehicles.columns.year"),
        field: "year",
        sortable: true,
        Cell: ({ entry: { year } }) => <div>{year || "-"}</div>,
      },

      {
        title: t("vehicles.columns.created_at"),
        field: "created_at",
        sortable: true,
        Cell: ({ entry: { created_at } }) => (
          <div>{formatDateTime(created_at || "", lang) || "-"}</div>
        ),
      },
      {
        title: t("vehicles.columns.updated_at"),
        field: "updated_at",
        Cell: ({ entry: { updated_at } }) => (
          <div>{formatDateTime(updated_at || "", lang) || "-"}</div>
        ),
      },
      {
        title: "",
        field: "id",

        Cell: ({ entry }) => (
          <QuickActions
            entity={"vehicles"}
            id={entry.id}
            actions={ACTIONS}
            onAction={(action, id) => handleAction(action, entry)}
          />
        ),
      },
    ],
    [t, lang, handleAction],
  );

  const updateMutation = useUpdateVehicle({
    mutationConfig: {
      onSuccess: () => {
        closeEdit();
      },
      onError: (error: ApiResponse<void>) => {
        if (error.errors) {
          setErrors(error.errors);
        }
        toast({
          title: error.message || t("global.errors.something_went_wrong"),
          type: "error",
        });

        if (!error.errors) {
          closeEdit();
        }
      },
    },
  });

  const handleEditSubmit = (payload: UpdateVehicleInputs) => {
    if (!vehicle?.id) return;
    updateMutation.mutate({ id: vehicle.id, payload });
  };
  return (
    <>
      <Table<Vehicle>
        data={vehicles}
        columns={columns}
        isLoading={isFetching}
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(vehicles.map((r) => r.id!))}
        sort={table.sort}
        onSortChange={table.setSorting}
        order={table.order}
        emptyMessage={t("vehicles.messages.empty")}
        pagination={{
          page: table.page,
          limit: table.limit,
          total: pagination?.total!,
          rootUrl: paths.admin.vehicles.route(),
        }}
      />

      <VehicleForm
        open={isEdit}
        onOpenChange={closeEdit}
        onClose={() => {
          setVehicle(undefined);
          closeEdit();
        }}
        onSubmit={handleEditSubmit}
        isDone={updateMutation.isSuccess}
        defaultValues={vehicle}
        apiErrors={errors}
        isLoading={updateMutation.isPending}
      />

      <VehicleDeleteDialog
        open={isDelete}
        onOpenChange={closeDelete}
        vehicle={vehicle!}
        onDeleted={() => {
          setVehicle(undefined);
          closeDelete();
        }}
      />
    </>
  );
};
