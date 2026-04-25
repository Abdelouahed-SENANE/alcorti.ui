"use client";
import { DashLayout } from "@/components/layouts/dashboard/_dash.layout";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { ShipperSelector } from "@/features/users/components/shipper.selector";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();
  const breadcrumbs = [
    {
      label: t("navigation.dashboard"),
      url: paths.admin.dashboard.route(),
      active: true,
    },
  ];
  return (
    <DashLayout
      title={t("dashboard.title")}
      desc={t("dashboard.desc")}
      breadcrumbs={breadcrumbs}
      actions={
        <Button className="gap-1" variant={"default"}>
          <Download className="size-4" />
          {t("dashboard.export")}
        </Button>
      }
    >
      <ShipperSelector />
    </DashLayout>
  );
}
