"use client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../drawer/drawer";

type FormDrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isDone: boolean;
  triggerButton?: React.ReactElement;
  submitButton: React.ReactElement;
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
};

export const FormDrawer = ({
  title,
  children,
  isDone,
  className,
  triggerButton,
  submitButton,
  onClose,
  open,
  onOpenChange,
}: FormDrawerProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const { t } = useTranslation();
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
  const handleOpen = () => {
    requestAnimationFrame(() => {
      handleOpenChange(true);
    });
  };

  return (
    <Drawer direction="right" open={actualOpen} onOpenChange={handleOpenChange}>
      {!isControlled && triggerButton && (
        <div onClick={handleOpen}>{triggerButton}</div>
      )}
      <DrawerContent
        aria-describedby="form-drawer"
        className={cn(
          "flex rounded-md   border border-border my-4  flex-col justify-between ",
          className,
        )}
      >
        <DrawerHeader className="border-b flex items-center flex-row w-full justify-between ">
          <DrawerTitle className="text-card-foreground">{title}</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="plain">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        {actualOpen && (
          <div className="px-4 min-w-xl! h-full overflow-y-auto">
            {children}
          </div>
        )}

        <DrawerFooter className="flex items-center flex-row w-full ltr:justify-start rtl:justify-end  ltr:flex-row-reverse rtl:flex-row">
          {submitButton}
          <DrawerClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
