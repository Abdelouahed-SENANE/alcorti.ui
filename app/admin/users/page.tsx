"use client";
import { DashLayout } from "@/components/layouts/dashboard/_dash.layout";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/form";
import { useQueryTable } from "@/components/ui/table";
import { paths } from "@/config/paths";
import { useUsers } from "@/features/admin/users/api/user.list";
import { UserTable } from "@/features/admin/users/components/user.table";
import { User } from "@/features/admin/users/user.type";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function UsersPage() {
  const { t } = useTranslation();
  const table = useQueryTable<User>();
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const usersQuery = useUsers({
    params: {
      page: table.page,
      limit: table.limit,
      term: table.term,
      sort: table.sort,
      order: table.order,
      active: isActive,
    },
  });

  const ACTIVES = useMemo(() => {
    return [
      {
        label: t("global.status.all"),
        value: undefined,
      },
      {
        label: t("global.status.active"),
        value: true,
      },
      {
        label: t("global.status.inactive"),
        value: false,
      },
    ];
  }, [t]);

  const items = usersQuery.data?.data?.items || [];
  const pagination = usersQuery.data?.data?.pagination;

  return (
    <DashLayout
      title={t("users.page.title")}
      desc={t("users.page.desc")}
      breadcrumbs={[
        {
          label: t("navigation.dashboard"),
          url: paths.admin.dashboard.route(),
          active: false,
        },
        {
          label: t("navigation.users"),
          url: paths.admin.users.route(),
          active: true,
        },
      ]}
      actions={
        <Button className="gap-1 " variant={"default"}>
          <Download className="size-4" />
          {t("users.actions.export")}
        </Button>
      }
    >
      <div className="flex  gap-2 items-center">
        <SearchInput
          value={table.term}
          onChange={(val) => table.setTerm(val)}
          delay={600}
          placeholder={t("global.search")}
        />
        <div className="flex flex-row gap-1 my-2">
          {ACTIVES.map((active, index) => (
            <Button
              key={index}
              variant={isActive === active.value ? "default" : "outline"}
              onClick={() => setIsActive(active.value)}
              className={cn(
                "rounded-md text-xxs",
                isActive === active.value &&
                  "bg-primary text-primary-foreground",
              )}
            >
              {active.label}
            </Button>
          ))}
        </div>
      </div>

      <UserTable
        users={items}
        isFetching={usersQuery.isFetching}
        table={table}
        pagination={pagination}
      />
    </DashLayout>
  );
}
