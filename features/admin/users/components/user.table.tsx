import { Badge } from "@/components/ui/badge";
import { QuickAction, QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import { useQueryTable } from "@/components/ui/table/use-query-table";
import i18n from "@/config/i18n";
import { paths } from "@/config/paths";
import { useDisclosure } from "@/hooks/use-disclosure";
import { cn, formatDateTime } from "@/lib/utils";
import { Lang, Pagination } from "@/types/api";
import { Edit, Eye, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "../user.type";
// import { ClientTableSkeleton } from "./skeletons/client.table-skeleton";
interface UserTableProps {
  users: User[];
  table: ReturnType<typeof useQueryTable<User>>;
  pagination?: Pagination;
  isFetching?: boolean;
}
export const UserTable = ({
  users,
  table,
  pagination,
  isFetching,
}: UserTableProps) => {
  const { t } = useTranslation();
  const [id, setId] = useState<string>("");
  const { open, close, isOpen } = useDisclosure();
  const lang = i18n.language as Lang;

  const handleAction = useCallback((action: string, id: string) => {
    switch (action) {
      case "delete":
        setId(id);
        open();
        break;
      default:
        break;
    }
  }, []);

  const ACTIONS: QuickAction[] = [
    {
      label: t("users.actions.view"),
      value: "view",
      icon: <Eye className="h-4 w-4 text-foreground" />,
    },
{
      label: t("users.actions.edit"),
      value: "edit",
      icon: <Edit className="h-4 w-4 text-foreground" />,
    },
    {
      label: t("users.actions.delete"),
      value: "delete",
      icon: <Trash className="h-4 w-4 text-foreground" />,
    },
  ];

  const columns = useMemo<TableColumn<User>[]>(
    () => [
      {
        title: t("users.columns.name"),
        field: "id",
        Cell: ({ entry: { first_name, last_name } }) => (
          <div>{`${first_name} ${last_name}`}</div>
        ),
      },
      {
        title: t("users.columns.email"),
        field: "email",
        Cell: ({ entry: { email } }) => <div>{email || "-"}</div>,
      },
      {
        title: t("users.columns.cin"),
        field: "cin",
        Cell: ({ entry: { cin } }) => <div>{cin || "-"}</div>,
      },
      {
        title: t("users.columns.phone"),
        field: "phone",
        Cell: ({ entry: { phone } }) => <div>{phone || "-"}</div>,
      },
      {
        title: t("users.columns.role"),
        field: "role",
        Cell: ({ entry: { role } }) => (
          <Badge
            className={cn(
              "capitalize",
              role === "Admin"
                ? "bg-primary/20 text-primary"
                : role === "Client"
                  ? "bg-orange-500/20 text-orange-500"
                  : "bg-secondary/20 text-secondary",
            )}
          >
            {role}
          </Badge>
        ),
      },
      {
        title: t("users.columns.is_active"),
        field: "is_active",
        Cell: ({ entry: { is_active } }) => (
          <Badge
            className={cn(
              "capitalize",
              is_active
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {is_active
              ? t("global.status.active")
              : t("global.status.inactive")}
          </Badge>
        ),
      },
      {
        title: t("users.columns.created_at"),
        field: "created_at",
        Cell: ({ entry: { created_at } }) => (
          <div>{formatDateTime(created_at, lang) || "-"}</div>
        ),
      },
      {
        title: t("users.columns.updated_at"),
        field: "updated_at",
        Cell: ({ entry: { updated_at } }) => (
          <div>{formatDateTime(updated_at, lang) || "-"}</div>
        ),
      },
      {
        title: "",
        field: "id",

        Cell: ({ entry: { id } }) => (
          <QuickActions
            entity={"users"}
            id={id}
            actions={ACTIONS}
            onAction={(action, id) => handleAction(action, id)}
            
          />
        ),
      },
    ],
    [t, lang, handleAction],
  );

  return (
    <>
      <Table<User>
        data={users}
        columns={columns}
        isLoading={isFetching}
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(users.map((r) => r.id!))}
        emptyMessage={t("users.messages.empty")}
        pagination={{
          page: table.page,
          limit: table.limit,
          total: pagination?.total!,
          rootUrl: paths.admin.users.route(),
        }}
      />
    </>
  );
};
