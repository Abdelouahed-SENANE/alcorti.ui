"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer/drawer";
import React from "react";

interface DetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export const DetailsDrawer = ({
  isOpen,
  onOpenChange,
  title,
  children,
}: DetailsDrawerProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full max-w-xl rounded-none border-l overflow-hidden">
        <DrawerHeader className="border-b px-6 py-4">
          <DrawerTitle className="text-xl font-bold">{title}</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar ">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
