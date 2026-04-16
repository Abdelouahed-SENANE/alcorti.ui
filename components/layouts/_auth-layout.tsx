"use client";
import { SwitchLanguage } from "@/components/ui/language/switch-language";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import React from "react";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center relative">
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex items-center gap-2">
        <SwitchLanguage />
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
};
