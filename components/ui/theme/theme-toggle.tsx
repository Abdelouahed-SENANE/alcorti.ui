"use client";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button/button";
import { useTheme } from "@/components/ui/theme/theme-provider";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant={"plain"}
      className="bg-transparent flex items-center justify-center text-primary hover:text-primary-hover hover:bg-none rounded-full hover:bg-primary/10 size-9"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Moon className="size-4.5" />
      ) : (
        <Sun className="size-4.5" />
      )}
    </Button>
  );
}
