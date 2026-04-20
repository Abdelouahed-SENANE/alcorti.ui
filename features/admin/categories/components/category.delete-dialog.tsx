import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/dialog/index";
import { toast } from "@/components/ui/toast/use-toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteCategory } from "../api/delete.category";
import { Category } from "../category.type";

type Props = {
  category: Category;
  onDeleted?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CategoryDeleteDialog = ({
  category,
  open,
  onOpenChange,
  onDeleted,
}: Props) => {
  const { t } = useTranslation();
  const deleteMutation = useDeleteCategory({
    mutationConfig: {
      onSuccess: () => {
        onOpenChange(false);
        onDeleted?.();
      },
      onError: (error: any) => {
        toast({
          title: t("categories.messages.errors.delete.title"),
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
    if (!category.id) return;
    deleteMutation.mutate(category.id);
  };

  return (
    <ConfirmationDialog
      open={internalOpen}
      onOpenChange={onOpenChange}
      title={t("categories.modal.delete.title")}
      body={t("categories.modal.delete.desc")}
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
            : t("categories.modal.delete.submit")}
        </Button>
      }
      cancelButton={(close: () => void) => (
        <Button
          variant="outline"
          onClick={close}
          disabled={deleteMutation.isPending}
        >
          {t("categories.modal.delete.cancel")}
        </Button>
      )}
    />
  );
};
