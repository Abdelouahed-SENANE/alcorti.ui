"use client";
import { cn } from "@/lib/utils";
import { Menu, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../button";
import { SwitchLanguage } from "../language/switch-language";
import { useSidebar } from "../sidebar";
import { ThemeToggle } from "../theme";
import { UserNavgation } from "../user-navigation";

type TopbarProps = {
  className?: string;
};
export const Topbar = ({ className }: TopbarProps) => {
  const { setCollapsed, isCollapsed } = useSidebar();
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "h-(--topbar-height) z-10 border-b bg-card px-2 ms-auto fixed inset-0 transition-[width] duration-300",
        isCollapsed
          ? "w-[calc(100%-var(--sidebar-collapsed))]"
          : "w-[calc(100%-var(--sidebar-expended))]",
        className,
      )}
    >
      <nav className="px-2 flex items-center justify-between h-full">
        <ul className="flex items-center">
          <li>
            <Button
              onClick={() => setCollapsed(!isCollapsed)}
              variant={"plain"}
              className="bg-transparent flex items-center justify-center text-card-foreground/60 hover:text-card-foreground hover:bg-none rounded-full hover:bg-input/40 size-9"
            >
              <Menu className="size-4.5" />
            </Button>
          </li>
        </ul>

        <ul className="flex items-center space-x-2">
          <li>
            <SwitchLanguage />
          </li>
          <li>
            <ThemeToggle />
          </li>
          {/* <li>
            <Button
              variant={"plain"}
              className="bg-transparent flex items-center justify-center text-card-foreground/60 hover:text-card-foreground hover:bg-none rounded-full hover:bg-input/40 size-9"
            >
              <Bell className="size-4.5" />
            </Button>
          </li> */}
          <li>
            <UserNavgation />
          </li>
        </ul>
      </nav>
    </div>
  );
};
