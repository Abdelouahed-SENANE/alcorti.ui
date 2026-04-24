"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer/drawer";
import React from "react";

interface OrderDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export const OrderDrawer = ({
  isOpen,
  onOpenChange,
  title,
  children,
}: OrderDrawerProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full max-w-xl rounded-none border-l overflow-hidden">
        <DrawerHeader className="border-b  p-4">
          <DrawerTitle className="text-xl font-semibold ltr:text-left rtl:text-right">{title}</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar ">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
