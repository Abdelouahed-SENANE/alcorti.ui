"use client";
import { SwitchLanguage } from "@/components/ui/language/switch-language";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import React from "react";

export const ContentLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex h-screen w-screen items-center justify-center relative">{children}</div>;
};
