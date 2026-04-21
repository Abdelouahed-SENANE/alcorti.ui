"use client";
import { DashLayout } from "@/components/layouts/dashboard/_dash.layout";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/form";
import { useQueryTable } from "@/components/ui/table";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import {
  CreateVehicleInputs,
  useCreateVehicle,
} from "@/features/vehicles/api/create.vehicle";
import { useVehicles } from "@/features/vehicles/api/vehicle.list";
import { VehicleForm } from "@/features/vehicles/components/vehicle.form";
import { VehicleTable } from "@/features/vehicles/components/vehicle.table";
import { Vehicle } from "@/features/vehicles/vehicle.type";
import { ApiResponse } from "@/types/api";
import { Download, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export default function VehiclesPage() {
  const { t } = useTranslation();
  const table = useQueryTable<Vehicle>();
  const vehiclesQuery = useVehicles({
    params: {
      page: table.page,
      limit: table.limit,
      term: table.term,
      sort: table.sort,
      order: table.order,
    },
  });

  const items = vehiclesQuery.data?.data?.items || [];
  const pagination = vehiclesQuery.data?.data?.pagination;

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateVehicleInputs, string[]>>
  >({});
  const createMutation = useCreateVehicle({
    mutationConfig: {
      onError: (res: ApiResponse<void>) => {
        const serverErrors = res.errors;
        if (serverErrors) {
          setErrors(serverErrors);
          toast({
            title: res.message || t("global.errors.validation"),
            type: "error",
          });
        } else {
          toast({
            title: res.message || t("global.errors.something_went_wrong"),
            type: "error",
          });
        }
      },
    },
  });

  const handleSubmit = useCallback((payload: CreateVehicleInputs) => {
    createMutation.mutate({ payload });
  }, []);

  return (
    <DashLayout
      title={t("vehicles.page.title")}
      desc={t("vehicles.page.desc")}
      breadcrumbs={[
        {
          label: t("navigation.dashboard"),
          url: paths.admin.dashboard.route(),
          active: false,
        },
        {
          label: t("navigation.vehicles"),
          url: paths.admin.vehicles.route(),
          active: true,
        },
      ]}
      actions={
        <div className="flex items-center gap-1">
          <VehicleForm
            apiErrors={errors}
            onSubmit={handleSubmit}
            isDone={createMutation.isSuccess}
            isLoading={createMutation.isPending}
            triggerButton={
              <Button className="gap-1 " variant={"default"}>
                <Plus className="size-4" />
                {t("vehicles.actions.add")}
              </Button>
            }
          />
          <Button className="gap-1 " variant={"secondary"}>
            <Download className="size-4" />
            {t("vehicles.actions.export")}
          </Button>
        </div>
      }
    >
      <div className="flex mb-2  gap-2 items-center">
        <SearchInput
          value={table.term}
          onChange={(val) => table.setTerm(val)}
          delay={600}
          placeholder={t("global.search")}
        />
      </div>

      <VehicleTable
        vehicles={items}
        isFetching={vehiclesQuery.isFetching}
        table={table}
        pagination={pagination}
      />
    </DashLayout>
  );
}
