"use client";
import {  Info, Trash2 } from "lucide-react";
import * as React from "react";

import { DialogDescription } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

export type ConfirmationDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerButton?: React.ReactElement;
  confirmButton: React.ReactElement;
  title: string;
  body?: string;
  children?: React.ReactNode;
  cancelButton?: (onCancel: () => void) => React.ReactElement;
  icon?: "danger" | "info" ;
  isDone?: boolean;
};

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  triggerButton,
  confirmButton,
  title,
  body = "",
  cancelButton,
  icon = "danger",
  isDone = false,
  children,
}: ConfirmationDialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const descriptionId = React.useId();
  const handleOpenChange = (isOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(isOpen);
    } else {
      setInternalOpen(isOpen);
    }
  };
  const close = () => handleOpenChange(false);

  React.useEffect(() => {
    if (isDone) {
      handleOpenChange(false);
    }
  }, [isDone]);


  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent
        className="sm:max-w-sm rounded-xl border-2 p-4 border-border "
        aria-describedby={descriptionId}
        
      >
        <DialogHeader className="flex">
          <DialogTitle className="flex flex-col mt-6 items-center text-2xl font-bold gap-1">
            {icon === "danger" && (
              <Trash2 className="size-12 text-error/80" aria-hidden="true" />
            )}
            {icon === "info" && (
              <Info className="size-6 text-primary" aria-hidden="true" />
            )}
            {title}
          </DialogTitle>
        </DialogHeader>

        {body && (
          <DialogDescription
            id={descriptionId}
            aria-describedby={descriptionId}
            className="text-center px-4 text-card-foreground/60"
          >{body}</DialogDescription>
        )}
        {children && <div className="mt-2">{children}</div>}

        <DialogFooter>
          <div className="flex items-center justify-end gap-2 w-full flex-row">
            {cancelButton && cancelButton(close)}
            {confirmButton}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
