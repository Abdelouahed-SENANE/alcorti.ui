"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/form";
import { Stepper } from "@/components/ui/stepper/stepper";
import { useStepper } from "@/components/ui/stepper/use-stepper";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShipmentOrderInputs, shipmentOrderSchema } from "../api/create.order";
import { GeneralStep } from "./steps/info.step";
import { ItemsStep } from "./steps/items.step";
import { SummaryStep } from "./steps/summary.step";

type ShipmentFormProps = {
  defaultValues?: ShipmentOrderInputs;
  onSubmit: (data: ShipmentOrderInputs) => void;
};

export const ShipmentForm = ({
  defaultValues,
  onSubmit,
}: ShipmentFormProps) => {
  const { t } = useTranslation();
  const stepper = useStepper({ totalSteps: 3 });

  const handeSubmit = (data: ShipmentOrderInputs) => {
    if (!stepper.isLast) return;
    onSubmit(data);
    stepper.reset();
  };

  return (
    <Form<typeof shipmentOrderSchema, ShipmentOrderInputs>
      schema={shipmentOrderSchema}
      onSubmit={handeSubmit}
      options={{
        defaultValues: {
          category_id: defaultValues?.category_id,
          description: defaultValues?.description,
          from_date: defaultValues?.from_date,
          to_date: defaultValues?.to_date,
          origin_id: defaultValues?.origin_id,
          destination_id: defaultValues?.destination_id,
          items: defaultValues?.items || [
            {
              description: "",
              length: undefined,
              width: undefined,
              height: undefined,
              weight: undefined,
              is_weight: false,
              unit: "cm",
              image: null,
            },
          ],
        },
      }}
    >
      {(form) => {
        const {
          trigger,
          control,
          setValue,
          formState: { errors, isSubmitting },
        } = form;
        const handleNext = async () => {
          let fieldsToValidate: any[] = [];
          if (stepper.currentStep === 1) {
            fieldsToValidate = [
              "category_id",
              "origin_id",
              "destination_id",
              "from_date",
              "to_date",
              "description",
            ];
          } else if (stepper.currentStep === 2) {
            fieldsToValidate = ["items"];
          }

          // If it's the last step, validate everything before calling the real onSubmit logic
          if (stepper.isLast) {
            const isValid = await trigger();
            if (isValid) {
              onSubmit(form.getValues());
            }
            return;
          }

          const isValid = await trigger(fieldsToValidate as any);
          if (isValid) {
            stepper.next();
          }
        };

        return (
          <div
            className="w-full max-w-4xl mx-auto space-y-6 p-4 md:p-8"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleNext();
              }
            }}
          >
            <div className="">
              <Stepper currentStep={stepper.currentStep}>
                <Stepper.Header className="bg-card p-4 md:p-6 rounded-2xl  border border-border">
                  <Stepper.Item
                    step={1}
                    title={t("shipments.form.steps.general.title")}
                  />
                  <Stepper.Item
                    step={2}
                    title={t("shipments.form.steps.items.title")}
                  />
                  <Stepper.Item
                    step={3}
                    title={t("shipments.form.steps.summary.title")}
                    isLast
                  />
                </Stepper.Header>

                <Stepper.Content className="bg-card p-4 md:p-6 rounded-2xl  border border-border">
                  <Stepper.Step step={1}>
                    <GeneralStep control={control} errors={errors} />
                  </Stepper.Step>
                  <Stepper.Step step={2}>
                    <ItemsStep
                      control={control}
                      errors={errors}
                      setValue={setValue}
                    />
                  </Stepper.Step>

                  {/* Step 3: Summary */}
                  <Stepper.Step step={3}>
                    <SummaryStep control={control} />
                  </Stepper.Step>
                </Stepper.Content>
              </Stepper>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border rtl:flex-row ltr:flex-row-reverse">
              <Button
                type="button"
                variant="outline"
                onClick={stepper.back}
                disabled={stepper.isFirst || isSubmitting}
                className="gap-2"
              >
                <ArrowLeft className="size-4 rtl:rotate-180" />
                {t("global.back")}
              </Button>

              <div className="flex gap-3">
                {!stepper.isLast ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="gap-2 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
                  >
                    {t("global.next")}
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="gap-2 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 animate-pulse-subtle"
                  >
                    <CheckCircle2 className="size-4" />
                    {t("shipments.form.submit")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      }}
    </Form>
  );
};

const SummaryItem = ({ icon: Icon, label, value, className }: any) => (
  <div className={cn("flex gap-3", className)}>
    <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <Icon className="size-5 text-primary" />
    </div>
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "-"}</span>
    </div>
  </div>
);
