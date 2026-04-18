import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/dialog/index";
import { toast } from "@/components/ui/toast/use-toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteVehicle } from "../api/delete.vehicle";
import { Vehicle } from "../vehicle.type";

type Props = {
  vehicle: Vehicle;
  onDeleted?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const VehicleDeleteDialog = ({
  vehicle,
  open,
  onOpenChange,
  onDeleted,
}: Props) => {
  const { t } = useTranslation();
  const deleteMutation = useDeleteVehicle({
    mutationConfig: {
      onSuccess: () => {
        onOpenChange(false);
        onDeleted?.();
      },
      onError: (error: any) => {
        toast({
          title: t("vehicles.messages.errors.delete.title"),
          description:
            error?.response?.data?.message || t("global.errors.something_went_wrong"),
          type: "error",
        });
      },
    },
  });
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => setInternalOpen(open), [open]);

  const handleConfirm = () => {
    if (!vehicle.id) return;
    deleteMutation.mutate({ id: vehicle.id });
    onDeleted?.();
  };

  return (
    <ConfirmationDialog
      open={internalOpen}
      onOpenChange={onOpenChange}
      title={t("vehicles.modal.delete.title")}
      body={t("vehicles.modal.delete.desc")}
      icon="danger"
      isDone={deleteMutation.isSuccess}
      confirmButton={
        <Button
          className="bg-destructive/80 hover:bg-destructive/60 flex items-center gap-2"
          onClick={handleConfirm}
          disabled={deleteMutation.isPending}
          isLoading={deleteMutation.isPending}
        >
          {deleteMutation.isPending
            ? t("global.deleting")
            : t("vehicles.modal.delete.submit")}
        </Button>
      }
      cancelButton={(close: () => void) => (
        <Button
          variant="outline"
          onClick={close}
          disabled={deleteMutation.isPending}
        >
          {t("vehicles.modal.delete.cancel")}
        </Button>
      )}
    />
  );
};