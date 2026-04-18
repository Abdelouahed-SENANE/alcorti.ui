"use client";
import { cn } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

type FormModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isDone: boolean;
  triggerButton?: React.ReactElement;
  submitButton: React.ReactElement;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
};

export const FormModal = ({
  title,
  children,
  isDone,
  triggerButton,
  submitButton,
  onClose,
  open,
  onOpenChange,
  className,
  description,
  icon,
}: FormModalProps) => {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (isOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(isOpen);
    } else {
      setInternalOpen(isOpen);
      if (!isOpen) {
        onClose?.();
      }
    }
  };

  React.useEffect(() => {
    if (isDone) {
      handleOpenChange(false);
    }
  }, [isDone]);

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      {!isControlled && triggerButton && (
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      )}

      <DialogContent
        showCloseButton={false}
        aria-describedby="form-modal"
        className={cn(
          "sm:max-w-2xl p-0 bg-card border border-border ",
          className,
        )}
      >
        <DialogHeader className="border-b flex flex-row items-center ltr:text-left rtl:text-right justify-between px-4 py-3">
          <div className="flex items-start gap-2">
            {icon}
            <div>
              <DialogTitle className="">{title}</DialogTitle>
              <DialogDescription className="text-sm text-card-foreground/70">
                {description}
              </DialogDescription>
            </div>
          </div>
          <DialogClose asChild>
            <Button
              variant="plain"
              className="items-center justify-center"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="px-4 py-3">{children}</div>

        <DialogFooter className="border-t flex flex-row items-center justify-end gap-2 px-4 py-3">
          <DialogClose asChild>
            <Button variant="outline">{t("global.actions.cancel")}</Button>
          </DialogClose>
          {submitButton}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
