import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/dialog/index";
import { toast } from "@/components/ui/toast/use-toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteLocation } from "../api/delete.location";
import { Location } from "../location.type";

type Props = {
  location: Location;
  onDeleted?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const LocationDeleteDialog = ({
  location,
  open,
  onOpenChange,
  onDeleted,
}: Props) => {
  const { t } = useTranslation();
  const deleteMutation = useDeleteLocation({
    mutationConfig: {
      onSuccess: () => {
        onOpenChange(false);
        onDeleted?.();
      },
      onError: (error: any) => {
        toast({
          title: t("locations.messages.errors.delete.title"),
          description:
            error?.response?.data?.message ||
            t("global.errors.something_went_wrong"),
          type: "error",
        });
      },
    },
  });
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => setInternalOpen(open), [open]);

  const handleConfirm = () => {
    if (!location.id) return;
    deleteMutation.mutate({ id: location.id });
    onDeleted?.();
  };

  return (
    <ConfirmationDialog
      open={internalOpen}
      onOpenChange={onOpenChange}
      title={t("locations.modal.delete.title")}
      body={t("locations.modal.delete.desc")}
      icon="danger"
      isDone={deleteMutation.isSuccess}
      confirmButton={
        <Button
          className="flex items-center gap-2"
          variant="destructive"
          onClick={handleConfirm}
          disabled={deleteMutation.isPending}
          isLoading={deleteMutation.isPending}
        >
          {deleteMutation.isPending
            ? t("global.deleting")
            : t("locations.modal.delete.submit")}
        </Button>
      }
      cancelButton={(close: () => void) => (
        <Button
          variant="outline"
          onClick={close}
          disabled={deleteMutation.isPending}
        >
          {t("locations.modal.delete.cancel")}
        </Button>
      )}
    />
  );
};
