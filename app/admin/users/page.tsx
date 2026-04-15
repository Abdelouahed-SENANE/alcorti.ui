"use client";
import { DashLayout } from "@/components/layouts/_dash-layout";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { Download, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UsersPage() {
  const { t } = useTranslation();
  return (
    <DashLayout
      title={t("users.title")}
      desc={t("users.desc")}
      breadcrumbs={[
        { label: t("navigation.dashboard"), url: paths.admin.dashboard.route(), active: true },
        { label: t("navigation.users"), url: paths.admin.users.route(), active: false },
      ]}
      actions={
        <Button className="gap-1 " variant={"default"}>
          <Plus className="size-4" />
          {t("users.add")}
        </Button>
      }
    >
      hello
    </DashLayout>
  );
}
