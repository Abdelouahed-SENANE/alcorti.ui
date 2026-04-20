import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { FormModal } from "@/components/ui/form/form-modal";
import { Edit, Save } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  CreateCategoryInputs,
  createCategorySchema,
} from "../api/create.category";
import {
  UpdateCategoryInputs,
  updateCategorySchema,
} from "../api/update.category";
import { Category } from "../category.type";
import { IconSelector } from "./icon.selector";

export type CategoryFormProps =
  | {
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
      onClose?: () => void;
      triggerButton?: React.ReactElement;
      onSubmit: (values: CreateCategoryInputs) => void;
      isDone: boolean;
      isLoading?: boolean;
      apiErrors: Partial<Record<keyof CreateCategoryInputs, string[]>>;
      defaultValues?: Partial<Category>;
    }
  | {
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
      onClose?: () => void;
      triggerButton?: React.ReactElement;
      onSubmit: (values: UpdateCategoryInputs) => void;
      isDone: boolean;
      defaultValues?: Partial<Category>;
      apiErrors: Partial<Record<keyof UpdateCategoryInputs, string[]>>;
      isLoading?: boolean;
    };

export const CategoryForm = ({
  triggerButton,
  onSubmit,
  isDone,
  isLoading,
  apiErrors,
  defaultValues,
  open,
  onOpenChange,
  onClose,
}: CategoryFormProps) => {
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
          ? "categories.form.create.title"
          : "categories.form.update.title",
      )}
      description={t(
        isCreate
          ? "categories.form.create.desc"
          : "categories.form.update.desc",
      )}
      triggerButton={triggerButton}
      isDone={isDone}
      submitButton={
        <Button
          form="category-form"
          type="submit"
          className="gap-1"
          variant="default"
          isLoading={isLoading}
        >
          {isCreate ? (
            <>
              <Save className="size-4" /> {t("categories.actions.create")}
            </>
          ) : (
            <>
              <Edit className="size-4" /> {t("categories.actions.edit")}
            </>
          )}
        </Button>
      }
    >
      <Form
        id="category-form"
        schema={isCreate ? createCategorySchema : (updateCategorySchema as any)}
        onSubmit={onSubmit as any}
        options={{
          defaultValues: {
            name_fr: defaultValues?.name_fr,
            name_ar: defaultValues?.name_ar,
            icon_name: defaultValues?.icon_name,
          },
        }}
      >
        {({ register, formState }) => {
          const errors = apiErrors as Record<string, string[]>;
          return (
            <div className="flex flex-col gap-2">
              <Input
                label={t("categories.form.fields.name_fr.label")}
                type="text"
                {...register("name_fr")}
                error={
                  (formState.errors.name_fr &&
                    t(`${formState.errors.name_fr?.message}`)) ||
                  errors.name_fr?.[0]
                }
              />
              <Input
                label={t("categories.form.fields.name_ar.label")}
                type="text"
                {...register("name_ar")}
                error={
                  (formState.errors.name_ar &&
                    t(`${formState.errors.name_ar?.message}`)) ||
                  errors.name_ar?.[0]
                }
              />
              <Controller
                name="icon_name"
                render={({ field, fieldState }) => (
                  <IconSelector
                    label={t("categories.form.fields.icon_name.label")}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={
                      (fieldState.error && t(`${fieldState.error.message}`)) ||
                      errors.icon_name?.[0]
                    }
                  />
                )}
              />
            </div>
          );
        }}
      </Form>
    </FormModal>
  );
};
