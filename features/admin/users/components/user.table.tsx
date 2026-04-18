import { Badge } from "@/components/ui/badge";
import { QuickAction, QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import { useQueryTable } from "@/components/ui/table/use-query-table";
import i18n from "@/config/i18n";
import { paths } from "@/config/paths";
import { useDisclosure } from "@/hooks/use-disclosure";
import { cn, formatDateTime } from "@/lib/utils";
import { Lang, Pagination } from "@/types/api";
import { Eye, Lock, Unlock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToggleAccountState } from "../api/account-state";
import { User } from "../user.type";
import { AccountStateDialog } from "./account-state.dialog";

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { open, close, isOpen } = useDisclosure();
  const lang = i18n.language as Lang;
  const router = useRouter();

  const toggleStatus = useToggleAccountState({
    mutationConfig: {
      onSuccess: () => {
        close();
        setSelectedUser(null);
      },
    },
  });

  const handleAction = useCallback(
    (action: string, user: User) => {
      switch (action) {
        case "review":
          router.push(paths.admin.users.review.route(user.id));
          break;
        case "block":
        case "unblock":
          setSelectedUser(user);
          open();
          break;
        default:
          break;
      }
    },
    [router, open],
  );

  const ACTIONS: QuickAction[] = [
    {
      label: t("users.actions.review"),
      value: "review",
      icon: <Eye className="h-4 w-4 text-foreground" />,
      check: (user: User) => user.status === "pending" && user.is_completed,
    },
    {
      label: t("users.actions.block"),
      value: "block",
      icon: <Lock className="h-4 w-4 text-foreground" />,
      check: (user: User) =>
        user.is_active && user.role !== "admin" && user.status === "approved",
    },
    {
      label: t("users.actions.unblock"),
      value: "unblock",
      icon: <Unlock className="h-4 w-4 text-foreground" />,
      check: (user: User) =>
        !user.is_active && user.role !== "admin" && user.status === "approved",
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
              "capitalize px-2 py-0.5",
              role === "admin"
                ? "bg-primary/20 text-primary border-none"
                : role === "client"
                  ? "bg-orange-500/20 text-orange-500 border-none"
                  : "bg-secondary/20 text-secondary border-none",
            )}
          >
            {role}
          </Badge>
        ),
      },
      {
        title: t("users.columns.status"),
        field: "status",
        Cell: ({ entry: { status } }) => (
          <Badge
            className={cn(
              "capitalize px-2 py-0.5 border-none",
              status === "approved"
                ? "bg-success/10 text-success"
                : status === "rejected"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-warning/10 text-warning",
            )}
          >
            {status}
          </Badge>
        ),
      },
      {
        title: t("users.columns.account_state"),
        field: "is_active",
        Cell: ({ entry: { is_active } }) => (
          <Badge
            className={cn(
              "capitalize px-2 py-0.5 border-none",
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
          <div>{formatDateTime(created_at!, lang) || "-"}</div>
        ),
      },
      {
        title: "",
        field: "id",
        Cell: ({ entry }) => (
          <QuickActions
            entity={entry}
            id={entry.id}
            actions={ACTIONS}
            onAction={(action) => handleAction(action, entry)}
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
      <AccountStateDialog
        isOpen={isOpen}
        user={selectedUser}
        onClose={close}
        onConfirm={() => toggleStatus.mutate({ id: selectedUser?.id! })}
        isLoading={toggleStatus.isPending}
      />
    </>
  );
};
