import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { FormModal } from "@/components/ui/form/form-modal";
import { handleNumericKeyDown } from "@/lib/utils";
import { Edit, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  CreateVehicleInputs,
  createVehicleSchema,
} from "../api/create.vehicle";
import {
  UpdateVehicleInputs,
  updateVehicleSchema,
} from "../api/update.vehicle";
import { Vehicle } from "../vehicle.type";

export type VehicleFormProps =
  | {
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
      onClose?: () => void;
      triggerButton?: React.ReactElement;
      onSubmit: (values: CreateVehicleInputs) => void;
      isDone: boolean;
      isLoading?: boolean;
      apiErrors: Partial<Record<keyof CreateVehicleInputs, string[]>>;
      defaultValues?: Partial<Vehicle>;
    }
  | {
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
      onClose?: () => void;
      triggerButton?: React.ReactElement;
      onSubmit: (values: UpdateVehicleInputs) => void;
      isDone: boolean;
      defaultValues?: Partial<Vehicle>;
      apiErrors: Partial<Record<keyof UpdateVehicleInputs, string[]>>;
      isLoading?: boolean;
    };

export const VehicleForm = ({
  triggerButton,
  onSubmit,
  isDone,
  isLoading,
  apiErrors,
  defaultValues,
  open,
  onOpenChange,
  onClose,
}: VehicleFormProps) => {
  const { t } = useTranslation();

  const isCreate = defaultValues === undefined;

  return (
    <FormModal
      className="max-w-sm!"
      open={open}
      onOpenChange={onOpenChange}
      onClose={onClose}
      title={t(
        isCreate ? "vehicles.form.create.title" : "vehicles.form.update.title",
      )}
      description={t(
        isCreate ? "vehicles.form.create.desc" : "vehicles.form.update.desc",
      )}
      triggerButton={triggerButton}
      isDone={isDone}
      submitButton={
        <Button
          form="vehicle-form"
          type="submit"
          className="gap-1"
          isLoading={isLoading}
        >
          {isCreate ? (
            <>
              <Save /> {t("vehicles.actions.create")}
            </>
          ) : (
            <>
              <Edit /> {t("vehicles.actions.edit")}
            </>
          )}
        </Button>
      }
    >
      <Form
        id="vehicle-form"
        schema={isCreate ? createVehicleSchema : updateVehicleSchema}
        onSubmit={onSubmit}
        options={{
          defaultValues: {
            brand: defaultValues?.brand,
            model: defaultValues?.model,
            year: defaultValues?.year,
            price_km: defaultValues?.price_km,
          },
        }}
      >
        {({ register, formState }) => {
          const errors = apiErrors as Record<string, string[]>;
          return (
            <div className="flex flex-col gap-2">
              <Input
                label={t("vehicles.form.fields.brand.label")}
                type="text"
                {...register("brand")}
                error={
                  (formState.errors.brand &&
                    t(`${formState.errors.brand?.message}`)) ||
                  errors.brand?.[0]
                }
              />
              <Input
                label={t("vehicles.form.fields.model.label")}
                type="text"
                {...register("model")}
                error={
                  (formState.errors.model &&
                    t(`${formState.errors.model?.message}`)) ||
                  errors.model?.[0]
                }
              />
              <Input
                label={t("vehicles.form.fields.year.label")}
                type="text"
                inputMode="numeric"
                maxLength={4}
                onKeyDown={handleNumericKeyDown}
                {...register("year", { valueAsNumber: true })}
                error={
                  (formState.errors.year &&
                    t(`${formState.errors.year?.message}`)) ||
                  errors.year?.[0]
                }
              />
              <Input
                label={t("vehicles.form.fields.price_km.label")}
                type="text"
                inputMode="numeric"
                onKeyDown={handleNumericKeyDown}
                {...register("price_km", { valueAsNumber: true })}
                error={
                  (formState.errors.price_km &&
                    t(`${formState.errors.price_km?.message}`)) ||
                  errors.price_km?.[0]
                }
              />
            </div>
          );
        }}
      </Form>
    </FormModal>
  );
};
