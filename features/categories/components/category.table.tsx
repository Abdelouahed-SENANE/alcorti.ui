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
  UpdateCategoryInputs,
  useUpdateCategory,
} from "../api/update.category";
import { Category } from "../category.type";
import { CategoryDeleteDialog } from "./category.delete-dialog";
import { CategoryForm } from "./category.form";

interface CategoryTableProps {
  categories: Category[];
  table: ReturnType<typeof useQueryTable<Category>>;
  pagination?: Pagination;
  isFetching?: boolean;
}

export const CategoryTable = ({
  categories,
  table,
  pagination,
  isFetching,
}: CategoryTableProps) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const { isOpen: isEdit, open: openEdit, close: closeEdit } = useDisclosure();
  const {
    isOpen: isDelete,
    open: openDelete,
    close: closeDelete,
  } = useDisclosure();
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateCategoryInputs, string[]>>
  >({});
  const lang = i18n.language as Lang;

  const handleAction = useCallback(
    (action: string, category: Category) => {
      switch (action) {
        case "delete":
          setCategory(category);
          openDelete();
          break;
        case "edit":
          setCategory(category);
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
      label: t("categories.actions.edit"),
      value: "edit",
      icon: <Edit className="h-4 w-4 text-foreground" />,
    },
    {
      label: t("categories.actions.delete"),
      value: "delete",
      icon: <Trash className="h-4 w-4 text-foreground" />,
    },
  ];

  const columns = useMemo<TableColumn<Category>[]>(
    () => [
      {
        title: t("categories.columns.name_fr"),
        field: "name_fr",
        sortable: true,
        Cell: ({ entry: { name_fr } }) => <span>{name_fr}</span>,
      },
      {
        title: t("categories.columns.name_ar"),
        field: "name_ar",
        sortable: true,
        Cell: ({ entry: { name_ar } }) => <span>{name_ar}</span>,
      },
      {
        title: t("categories.columns.icon_name"),
        field: "icon_name",
        sortable: false,
        Cell: ({ entry: { icon_name } }) => <span>{icon_name}</span>,
      },
      {
        title: t("categories.columns.created_at"),
        field: "created_at",
        sortable: true,
        Cell: ({ entry: { created_at } }) => (
          <div>{formatDateTime(created_at || "", lang) || "-"}</div>
        ),
      },
      {
        title: t("categories.columns.updated_at"),
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
            entity={"categories"}
            id={entry.id}
            actions={ACTIONS}
            onAction={(action, id) => handleAction(action, entry)}
          />
        ),
      },
    ],
    [t, lang, handleAction],
  );

  const updateMutation = useUpdateCategory({
    mutationConfig: {
      onSuccess: () => {
        closeEdit();
      },
      onError: (res: any) => {
        const errors = res.response?.data?.errors;
        if (errors) {
          setErrors(errors);
        }
        toast({
          title: res.response?.data?.message || t("global.errors.something_went_wrong"),
          type: "error",
        });

        if (!errors) {
          closeEdit();
        }
      },
    },
  });

  const handleEditSubmit = (payload: UpdateCategoryInputs) => {
    if (!category?.id) return;
    updateMutation.mutate({ id: category.id, payload });
  };

  return (
    <>
      <Table<Category>
        data={categories}
        columns={columns}
        isLoading={isFetching}
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(categories.map((r) => r.id!))}
        sort={table.sort}
        onSortChange={table.setSorting}
        order={table.order}
        emptyMessage={t("categories.messages.empty")}
        pagination={{
          page: table.page,
          limit: table.limit,
          total: pagination?.total!,
          rootUrl: paths.admin.shipments.categories.route(),
        }}
      />

      <CategoryForm
        open={isEdit}
        onOpenChange={closeEdit}
        onClose={() => {
          setCategory(undefined);
          closeEdit();
        }}
        onSubmit={handleEditSubmit}
        isDone={updateMutation.isSuccess}
        defaultValues={category}
        apiErrors={errors}
        isLoading={updateMutation.isPending}
      />

      <CategoryDeleteDialog
        open={isDelete}
        onOpenChange={closeDelete}
        category={category!}
        onDeleted={() => {
          setCategory(undefined);
          closeDelete();
        }}
      />
    </>
  );
};
