"use client";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import {
  ShipmentOrderInputs,
  useCreateOrder,
} from "@/features/shipments/api/create.order";
import { ShipmentForm } from "@/features/shipments/components/shipment.form";
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
        }
        toast({
          title: t("shipments.form.error_title"),
          description: error.response.data.message,
          type: "error",
        });
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
    <div>
      <h1>{t("shipments.form.title")}</h1>
      <ShipmentForm onSubmit={onSubmit} />
    </div>
  );
}
