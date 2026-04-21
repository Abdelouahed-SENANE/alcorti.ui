"use client";
import { DashLayout } from "@/components/layouts/dashboard/_dash.layout";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/form";
import { useQueryTable } from "@/components/ui/table";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import {
  CreateLocationInputs,
  useCreateLocation,
} from "@/features/locations/api/create.location";
import { useLocations } from "@/features/locations/api/location.list";
import { LocationForm } from "@/features/locations/components/location.form";
import { LocationTable } from "@/features/locations/components/location.table";
import { Location } from "@/features/locations/location.type";
import { ApiResponse } from "@/types/api";
import { Download, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LocationsPage() {
  const { t } = useTranslation();
  const table = useQueryTable<Location>();
  const locationsQuery = useLocations({
    params: {
      page: table.page,
      limit: table.limit,
      term: table.term,
      sort: table.sort,
      order: table.order,
    },
  });

  const items = locationsQuery.data?.data?.items || [];
  const pagination = locationsQuery.data?.data?.pagination;

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateLocationInputs, string[]>>
  >({});
  const createMutation = useCreateLocation({
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

  const handleSubmit = useCallback((payload: CreateLocationInputs) => {
    createMutation.mutate({ payload });
  }, []);

  return (
    <DashLayout
      title={t("locations.page.title")}
      desc={t("locations.page.desc")}
      breadcrumbs={[
        {
          label: t("navigation.dashboard"),
          url: paths.admin.dashboard.route(),
          active: false,
        },
        {
          label: t("navigation.locations"),
          url: paths.admin.locations.route(),
          active: true,
        },
      ]}
      actions={
        <div className="flex items-center gap-1">
          <LocationForm
            apiErrors={errors}
            onSubmit={handleSubmit}
            isDone={createMutation.isSuccess}
            isLoading={createMutation.isPending}
            triggerButton={
              <Button className="gap-1 " variant={"default"}>
                <Plus className="size-4" />
                {t("locations.actions.add")}
              </Button>
            }
          />
          <Button className="gap-1 " variant={"secondary"}>
            <Download className="size-4" />
            {t("locations.actions.export")}
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

      <LocationTable
        locations={items}
        isFetching={locationsQuery.isFetching}
        table={table}
        pagination={pagination}
      />
    </DashLayout>
  );
}
