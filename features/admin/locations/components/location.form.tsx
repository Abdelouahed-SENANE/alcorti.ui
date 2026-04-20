import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { FormModal } from "@/components/ui/form/form-modal";
import { Edit, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  CreateLocationInputs,
  createLocationSchema,
} from "../api/create.location";
import {
  UpdateLocationInputs,
  updateLocationSchema,
} from "../api/update.location";
import { Location } from "../location.type";

export type LocationFormProps =
  | {
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
      onClose?: () => void;
      triggerButton?: React.ReactElement;
      onSubmit: (values: CreateLocationInputs) => void;
      isDone: boolean;
      isLoading?: boolean;
      apiErrors: Partial<Record<keyof CreateLocationInputs, string[]>>;
      defaultValues?: Partial<Location>;
    }
  | {
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
      onClose?: () => void;
      triggerButton?: React.ReactElement;
      onSubmit: (values: UpdateLocationInputs) => void;
      isDone: boolean;
      defaultValues?: Partial<Location>;
      apiErrors: Partial<Record<keyof UpdateLocationInputs, string[]>>;
      isLoading?: boolean;
    };

export const LocationForm = ({
  triggerButton,
  onSubmit,
  isDone,
  isLoading,
  apiErrors,
  defaultValues,
  open,
  onOpenChange,
  onClose,
}: LocationFormProps) => {
  const { t } = useTranslation();

  const isCreate = defaultValues === undefined;

  return (
    <FormModal
      className="max-w-sm!"
      open={open}
      onOpenChange={onOpenChange}
      onClose={onClose}
      title={t(
        isCreate
          ? "locations.form.create.title"
          : "locations.form.update.title",
      )}
      description={t(
        isCreate ? "locations.form.create.desc" : "locations.form.update.desc",
      )}
      triggerButton={triggerButton}
      isDone={isDone}
      submitButton={
        <Button
          form="location-form"
          type="submit"
          className="gap-1"
          variant="default"
          isLoading={isLoading}
        >
          {isCreate ? (
            <>
              <Save /> {t("locations.actions.create")}
            </>
          ) : (
            <>
              <Edit /> {t("locations.actions.edit")}
            </>
          )}
        </Button>
      }
    >
      <Form
        id="location-form"
        schema={isCreate ? createLocationSchema : updateLocationSchema}
        onSubmit={onSubmit as any}
        options={{
          defaultValues: {
            name_fr: defaultValues?.name_fr,
            name_en: defaultValues?.name_en,
            name_ar: defaultValues?.name_ar,
            lat: defaultValues?.lat,
            lng: defaultValues?.lng,
          },
        }}
      >
        {({ register, formState }) => {
          const errors = apiErrors as Record<string, string[]>;
          return (
            <div className="flex flex-col gap-2">
              <Input
                label={t("locations.form.fields.name_fr.label")}
                type="text"
                {...register("name_fr")}
                error={
                  (formState.errors.name_fr &&
                    t(`${formState.errors.name_fr?.message}`)) ||
                  errors.name_fr?.[0]
                }
              />
              <Input
                label={t("locations.form.fields.name_en.label")}
                type="text"
                {...register("name_en")}
                error={
                  (formState.errors.name_en &&
                    t(`${formState.errors.name_en?.message}`)) ||
                  errors.name_en?.[0]
                }
              />
              <Input
                label={t("locations.form.fields.name_ar.label")}
                type="text"
                {...register("name_ar")}
                error={
                  (formState.errors.name_ar &&
                    t(`${formState.errors.name_ar?.message}`)) ||
                  errors.name_ar?.[0]
                }
              />
              <Input
                label={t("locations.form.fields.lat.label")}
                type="text"
                inputMode="numeric"
                onKeyDown={(e) => {
                  if (
                    !/[0-9.]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight" &&
                    e.key !== "Tab" &&
                    e.key !== "-"
                  ) {
                    e.preventDefault();
                  }
                }}
                {...register("lat", { valueAsNumber: true })}
                error={
                  (formState.errors.lat &&
                    t(`${formState.errors.lat?.message}`)) ||
                  errors.lat?.[0]
                }
              />
              <Input
                label={t("locations.form.fields.lng.label")}
                type="text"
                inputMode="numeric"
                onKeyDown={(e) => {
                  if (
                    !/[0-9.]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight" &&
                    e.key !== "Tab" &&
                    e.key !== "-"
                  ) {
                    e.preventDefault();
                  }
                }}
                {...register("lng", { valueAsNumber: true })}
                error={
                  (formState.errors.lng &&
                    t(`${formState.errors.lng?.message}`)) ||
                  errors.lng?.[0]
                }
              />
            </div>
          );
        }}
      </Form>
    </FormModal>
  );
};
