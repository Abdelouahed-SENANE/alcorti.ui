"use client";
import { toast } from "@/components/ui/toast/use-toast";
import {
  ShipmentOrderInputs,
  useCreateOrder,
} from "@/features/shipments/api/orders/create.order";
import { ShipmentOrderForm } from "@/features/shipments/components/orders/order.form";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function NewShipmentOrderPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const createShipmentOrder = useCreateOrder({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("shipments.form.success_title"),
          description: t("shipments.form.success_message"),
          type: "success",
        });

        router.back();
      },
      onError: (error: any) => {
        if (error.response.status === 422) {
          const rawErrors = error.response.data.errors;
          const errors = Array.isArray(rawErrors)
            ? rawErrors.map((err: any) => err.message || err).join(", ")
            : typeof rawErrors === "object" && rawErrors !== null
              ? Object.values(rawErrors).flat().join(", ")
              : rawErrors;

          toast({
            title: t("shipments.orders.validation_error"),
            description: errors,
            type: "error",
          });
        } else {
          toast({
            title: t("shipments.orders.error_title"),
            description: error.response.data.message,
            type: "error",
          });
        }
      },
    },
  });
  const onSubmit = useCallback(
    (payload: ShipmentOrderInputs) => {
      createShipmentOrder.mutate({ payload });
    },
    [createShipmentOrder],
  );

  return (
    <ShipmentOrderForm onSubmit={onSubmit} />
  );
}
