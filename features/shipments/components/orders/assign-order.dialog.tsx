"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form/form";
import { FormModal } from "@/components/ui/form/form-modal";
import { toast } from "@/components/ui/toast/use-toast";
import { ShipperSelector } from "@/features/users/components/shipper.selector";
import { useTranslation } from "react-i18next";
import {
  useAssignOrder,
  type AssignOrderInputs,
  assignOrderSchema,
} from "../../api/orders/assign.order";

interface OrderAssignDialogProps {
  orderId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const OrderAssignDialog = ({
  orderId,
  isOpen,
  onOpenChange,
  onSuccess,
}: OrderAssignDialogProps) => {
  const { t } = useTranslation();

  const assignMutation = useAssignOrder({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t(
            "shipments.orders.assign.success",
            "Order assigned successfully",
          ),
          variant: "default",
          type: "success",
        });
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error: any) => {
        toast({
          title: t("shipments.orders.assign.error", "Failed to assign order"),
          description:
            error?.response?.data?.message ||
            t("global.errors.unknown", "An error occurred"),
          variant: "destructive",
          type: "error",
        });
      },
    },
  });

  const handleAssign = (payload: AssignOrderInputs) => {
    assignMutation.mutate({
      id: orderId,
      payload,
    });
  };

  const isPending = assignMutation.isPending;

  return (
    <FormModal
      open={isOpen}
      className="max-w-md!"
      onOpenChange={onOpenChange}
      isDone={assignMutation.isSuccess}
      title={t("shipments.orders.modals.assign.title", "Assign Order")}
      description={t(
        "shipments.orders.modals.assign.description",
        "Select an approved shipper from the list below to assign this delivery task.",
      )}
      submitButton={
        <Button
          type="submit"
          form="assign-order-form"
          disabled={isPending}
          className="font-bold bg-primary text-primary-foreground shadow-lg active:scale-95"
        >
          {isPending
            ? t("global.loading", "Loading...")
            : t("shipments.orders.actions.assign", "Assign")}
        </Button>
      }
    >
      <Form
        id="assign-order-form"
        schema={assignOrderSchema}
        onSubmit={handleAssign}
        options={{
          defaultValues: {
            status: "assigned",
            shipper_id: "",
          },
        }}
      >
        {(form) => (
          <FormField
            control={form.control}
            name="shipper_id"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <ShipperSelector
                    label={t("users.shipper.title", "Shipper")}
                    isRequired
                    onSelect={(shipper) => field.onChange(shipper?.id)}
                    placeholder={t(
                      "shipments.orders.assign.shipper_placeholder",
                      "Search for a shipper...",
                    )}
                    error={form.formState.errors.shipper_id?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </Form>
    </FormModal>
  );
};
