"use client";
import { DashLayout } from "@/components/layouts/dashboard/_dash.layout";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/form";
import { useQueryTable } from "@/components/ui/table";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
// import {
//   CreateLocationInputs,
//   useCreateLocation,
// } from "@/features/admin/orders/api/create.order";
// import { useLocations } from "@/features/admin/orders/api/order.list";
// import { LocationForm } from "@/features/admin/orders/components/order.form";
// import { Location } from "@/features/admin/orders/order.type";
import { ApiResponse } from "@/types/api";
import { Download, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LocationsPage() {
  const { t } = useTranslation();
//   const table = useQueryTable<Location>();
//   const odersQuery = useLocations({
//     params: {
//       page: table.page,
//       limit: table.limit,
//       term: table.term,
//       sort: table.sort,
//       order: table.order,
//     },
//   });

//   const items = odersQuery.data?.data?.items || [];
//   const pagination = odersQuery.data?.data?.pagination;

  return (
    <DashLayout
      title={t("orders.page.title")}
      desc={t("orders.page.desc")}
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
          {/* <LocationForm
            apiErrors={errors}
            onSubmit={handleSubmit}
            isDone={createMutation.isSuccess}
            isLoading={createMutation.isPending}
            triggerButton={
              <Button className="gap-1 " variant={"default"}>
                <Plus className="size-4" />
                {t("orders.actions.add")}
              </Button>
            }
          /> */}
          <Button className="gap-1 " variant={"secondary"}>
            <Download className="size-4" />
            {t("orders.actions.export")}
          </Button>
        </div>
      }
    >
      <div className="flex mb-2  gap-2 items-center">
        {/* <SearchInput
          value={table.term}
          onChange={(val) => table.setTerm(val)}
          delay={600}
          placeholder={t("global.search")}
        /> */}
      </div>
    </DashLayout>
  );
}
