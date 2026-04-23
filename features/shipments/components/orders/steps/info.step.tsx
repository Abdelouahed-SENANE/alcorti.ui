"use client";

import { Input } from "@/components/ui/form";
import { InputCalendar } from "@/components/ui/form/input-calander";
import { CategorySelector } from "@/features/categories/components/category.selector";
import { LocationSelector } from "@/features/locations/components/location.selector";
import { LocationOption } from "@/features/locations/location.type";
import { ShipmentOrderInputs } from "@/features/shipments/api/orders/create.order";
import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface GeneralInfoStepProps {
  control: Control<ShipmentOrderInputs>;
  errors: any;
}

export const GeneralStep = ({ control, errors }: GeneralInfoStepProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...control.register("description")}
          className="w-full col-span-2"
          label={t("shipments.form.description.label")}
          error={errors.description?.message}
        />
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <CategorySelector
              isRequired
              label={t("shipments.form.category.label")}
              defaultValue={field.value}
              onSelect={(val) => field.onChange(val.id)}
              error={t(errors.category_id?.message)}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="origin_id"
          control={control}
          render={({ field }) => (
            <LocationSelector
              isRequired
              defaultValue={field.value}
              onSelect={(location: LocationOption) =>
                field.onChange(location.value)
              }
              error={t(errors.origin_id?.message)}
              label={t("shipments.form.origin.label")}
            />
          )}
        />

        <Controller
          name="destination_id"
          control={control}
          render={({ field }) => (
            <LocationSelector
              isRequired
              defaultValue={field.value}
              onSelect={(val) => field.onChange(val.value)}
              error={t(errors.destination_id?.message)}
              label={t("shipments.form.destination.label")}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="from_date"
          control={control}
          render={({ field }) => (
            <InputCalendar
              error={t(errors.from_date?.message)}
              isRequired
              label={t("shipments.form.available_from.label")}
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date: Date | undefined) =>
                field.onChange(date?.toISOString())
              }
            />
          )}
        />

        <Controller
          name="to_date"
          control={control}
          render={({ field }) => (
            <InputCalendar
              isRequired
              label={t("shipments.form.available_to.label")}
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date: Date | undefined) =>
                field.onChange(date?.toISOString())
              }
              error={t(errors.to_date?.message)}
            />
          )}
        />
      </div>
    </div>
  );
};
