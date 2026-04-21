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
import {
  UpdateLocationInputs,
  useUpdateLocation,
} from "../api/update.location";
import { Location } from "../location.type";
import { LocationDeleteDialog } from "./location.delete-dialog";
import { LocationForm } from "./location.form";

interface LocationTableProps {
  locations: Location[];
  table: ReturnType<typeof useQueryTable<Location>>;
  pagination?: Pagination;
  isFetching?: boolean;
}

export const LocationTable = ({
  locations,
  table,
  pagination,
  isFetching,
}: LocationTableProps) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const { isOpen: isEdit, open: openEdit, close: closeEdit } = useDisclosure();
  const {
    isOpen: isDelete,
    open: openDelete,
    close: closeDelete,
  } = useDisclosure();
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateLocationInputs, string[]>>
  >({});
  const lang = i18n.language as Lang;

  const handleAction = useCallback(
    (action: string, location: Location) => {
      switch (action) {
        case "delete":
          setLocation(location);
          openDelete();
          break;
        case "edit":
          setLocation(location);
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
      label: t("locations.actions.edit"),
      value: "edit",
      icon: <Edit className="h-4 w-4 text-foreground" />,
    },
    {
      label: t("locations.actions.delete"),
      value: "delete",
      icon: <Trash className="h-4 w-4 text-foreground" />,
    },
  ];

  const columns = useMemo<TableColumn<Location>[]>(
    () => [
      {
        title: t("locations.columns.name_fr"),
        field: "name_fr",
        sortable: true,
        Cell: ({ entry: { name_fr } }) => <span>{name_fr}</span>,
      },
      {
        title: t("locations.columns.name_en"),
        field: "name_en",
        sortable: true,
        Cell: ({ entry: { name_en } }) => <span>{name_en}</span>,
      },
      {
        title: t("locations.columns.name_ar"),
        field: "name_ar",
        sortable: true,
        Cell: ({ entry: { name_ar } }) => <span>{name_ar}</span>,
      },
      {
        title: t("locations.columns.lat"),
        field: "lat",
        sortable: true,
        Cell: ({ entry: { lat } }) => <div dir="ltr" className="ltr:text-left rtl:text-right">{lat}</div>,
      },
      {
        title: t("locations.columns.lng"),
        field: "lng",
        sortable: true,
        Cell: ({ entry: { lng } }) => <div dir="ltr" className="ltr:text-left rtl:text-right">{lng}</div>,
      },
      {
        title: t("locations.columns.created_at"),
        field: "created_at",
        sortable: true,
        Cell: ({ entry: { created_at } }) => (
          <div>{formatDateTime(created_at || "", lang) || "-"}</div>
        ),
      },
      {
        title: t("locations.columns.updated_at"),
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
            entity={"locations"}
            id={entry.id}
            actions={ACTIONS}
            onAction={(action, id) => handleAction(action, entry)}
          />
        ),
      },
    ],
    [t, lang, handleAction],
  );

  const updateMutation = useUpdateLocation({
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

  const handleEditSubmit = (payload: UpdateLocationInputs) => {
    if (!location?.id) return;
    updateMutation.mutate({ id: location.id, payload });
  };

  return (
    <>
      <Table<Location>
        data={locations}
        columns={columns}
        isLoading={isFetching}
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(locations.map((r) => r.id!))}
        sort={table.sort}
        onSortChange={table.setSorting}
        order={table.order}
        emptyMessage={t("locations.messages.empty")}
        pagination={{
          page: table.page,
          limit: table.limit,
          total: pagination?.total!,
          rootUrl: paths.admin.locations.route(),
        }}
      />

      <LocationForm
        open={isEdit}
        onOpenChange={closeEdit}
        onClose={() => {
          setLocation(undefined);
          closeEdit();
        }}
        onSubmit={handleEditSubmit}
        isDone={updateMutation.isSuccess}
        defaultValues={location}
        apiErrors={errors}
        isLoading={updateMutation.isPending}
      />

      <LocationDeleteDialog
        open={isDelete}
        onOpenChange={closeDelete}
        location={location!}
        onDeleted={() => {
          setLocation(undefined);
          closeDelete();
        }}
      />
    </>
  );
};
