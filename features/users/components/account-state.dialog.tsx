"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { User } from "../user.type";

interface AccountStateDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const AccountStateDialog = ({
  user,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: AccountStateDialogProps) => {
  const { t } = useTranslation();

  if (!user) return null;

  const isActive = user.is_active;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] border-none bg-card p-6 gap-6 rounded-2xl shadow-2xl">
        <DialogHeader className="items-center sm:items-center text-center gap-4">
          <div
            className={cn(
              "p-3 rounded-full",
              isActive ? "bg-warning/10" : "bg-success/10",
            )}
          >
            {isActive ? (
              <AlertTriangle className="size-8 text-warning" />
            ) : (
              <CheckCircle2 className="size-8 text-success" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-xl font-bold text-card-foreground ltr:text-left rtl:text-right">
              {isActive
                ? t(
                    "users.dialogs.deactivate.title",
                    "Deactivate this account?",
                  )
                : t("users.dialogs.activate.title", "Reactivate this account?")}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground leading-relaxed ltr:text-left rtl:text-right">
              {isActive
                ? t(
                    "users.dialogs.deactivate.description",
                    "The user will be signed out and won't be able to log in until you reactivate the account.",
                  )
                : t(
                    "users.dialogs.activate.description",
                    "The user will be able to log in again and regain full access to their account.",
                  )}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="sm:justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-6"
          >
            {t("global.cancel", "Cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            variant={isActive ? "warning" : "success"}
            isLoading={isLoading}
          >
            {isActive
              ? t("users.actions.deactivate", "Deactivate")
              : t("users.actions.activate", "Reactivate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
