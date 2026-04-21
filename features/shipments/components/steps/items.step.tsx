"use client";

import { Button } from "@/components/ui/button";
import { SelectField, Switch, Textarea } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/form/image-upload";
import { NumericInput } from "@/components/ui/form/numeric-input";
import { Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { Control, Controller, useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ShipmentOrderInputs } from "../../shipment.type";

interface ItemsStepProps {
  control: Control<ShipmentOrderInputs>;
  errors: any;
  setValue: any;
}

export const ItemsStep = ({ control, errors, setValue }: ItemsStepProps) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const itemsWatch = useWatch({
    control,
    name: "items",
  });
  console.log(itemsWatch);

  const units = useMemo(() => {
    return [
      { label: t("global.units.centimeter"), value: "cm" },
      { label: t("global.units.meter"), value: "m" },
    ];
  }, [t]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border border-border/50 rounded-lg bg-card relative group"
          >
            <div>
              <h4 className="text-lg font-semibold">
                {t("global.item")} {index + 1}
              </h4>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 ltr:right-2 rtl:left-2 text-white hover:text-white bg-destructive hover:bg-destructive/90"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <div className="mt-2">
                {/* <label htmlFor="description">
                  {t("shipments.form.items.description.label")}
                </label> */}
                <Textarea
                  className="h-14"
                  placeholder={t(
                    "shipments.form.items.description.placeholder",
                  )}
                  error={t(errors.items?.[index]?.description?.message)}
                  registration={control.register(
                    `items.${index}.description` as const,
                  )}
                />
              </div>

              <div className="grid grid-cols-4  gap-2 max-w-xl">
                <NumericInput
                  label={t("shipments.form.items.length.label", {
                    unit: t(
                      `global.units.${itemsWatch?.[index]?.unit}` as const,
                    ),
                  })}
                  error={t(errors.items?.[index]?.length?.message)}
                  registration={control.register(
                    `items.${index}.length` as const,
                    { valueAsNumber: true },
                  )}
                  isRequired
                />
                <NumericInput
                  label={t("shipments.form.items.width.label", {
                    unit: t(
                      `global.units.${itemsWatch?.[index]?.unit}` as const,
                    ),
                  })}
                  error={t(errors.items?.[index]?.width?.message)}
                  registration={control.register(
                    `items.${index}.width` as const,
                    { valueAsNumber: true },
                  )}
                  isRequired
                />
                <NumericInput
                  label={t("shipments.form.items.height.label", {
                    unit: t(
                      `global.units.${itemsWatch?.[index]?.unit}` as const,
                    ),
                  })}
                  error={t(errors.items?.[index]?.height?.message)}
                  registration={control.register(
                    `items.${index}.height` as const,
                    { valueAsNumber: true },
                  )}
                  isRequired
                />
                <div className="max-w-30">
                  <div className="w-full">
                    <Controller
                      control={control}
                      name={`items.${index}.unit` as const}
                      render={({ field: { onChange, value } }) => (
                        <SelectField
                          label={t("shipments.form.items.unit.label")}
                          error={t(errors.items?.[index]?.unit?.message)}
                          value={value}
                          onChange={onChange}
                          options={units}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name={`items.${index}.is_weight` as const}
                    render={({ field: { value, onChange } }) => (
                      <Switch
                        id={`items.${index}.is_weight`}
                        checked={value}
                        onCheckedChange={(checked) => {
                          onChange(checked);
                          if (!checked) {
                            setValue(`items.${index}.weight`, 0.1);
                          }
                        }}
                      />
                    )}
                  />
                  <label
                    htmlFor={`items.${index}.is_weight`}
                    className="cursor-pointer"
                  >
                    {t("global.is_weight_known")}
                  </label>
                </div>
                {itemsWatch?.[index]?.is_weight && (
                  <NumericInput
                    label={t("shipments.form.items.weight.label")}
                    error={t(errors.items?.[index]?.weight?.message)}
                    registration={control.register(
                      `items.${index}.weight` as const,
                      { valueAsNumber: true },
                    )}
                    isRequired
                  />
                )}
              </div>

              <ImageUpload
                label={t("shipments.form.items.image.label")}
                onChange={(file) => setValue(`items.${index}.image`, file)}
                error={errors.items?.[index]?.image?.message}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full gap-2 border-dashed border-2 bg-transparent hover:bg-primary/5"
        onClick={() =>
          append({
            description: "",
            length: 0,
            width: 0,
            height: 0,
            weight: 0,
            is_weight: false,
            unit: "cm",
            image: null,
          })
        }
      >
        <Plus className="size-4" />
        {t("shipments.form.items.add")}
      </Button>
    </div>
  );
};
