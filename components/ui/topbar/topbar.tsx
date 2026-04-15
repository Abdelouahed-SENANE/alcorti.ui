"use client";
import { cn } from "@/lib/utils";
import { SidebarClose, SidebarOpen } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../breadcrumb";
import { Button } from "../button";
import { SwitchLanguage } from "../language/switch-language";
import { RouterLink } from "../link";
import { useSidebar } from "../sidebar";
import { ThemeToggle } from "../theme";
import { UserNavgation } from "../user-navigation";

type TopbarProps = {
  className?: string;
  breadcrumbs?: { label: React.ReactNode; url: string; active?: boolean }[];
};
export const Topbar = ({ className, breadcrumbs = [] }: TopbarProps) => {
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
              className="bg-transparent flex items-center justify-center text-primary hover:text-primary-hover hover:bg-none rounded-full hover:bg-primary/10 size-9"
            >
              {isCollapsed ? (
                <SidebarClose className="size-4.5" />
              ) : (
                <SidebarOpen className="size-4.5" />
              )}
            </Button>
          </li>
          <li>
            <Breadcrumb>
              <BreadcrumbList className="flex items-center  ">
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    {index === 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <RouterLink
                          className={cn(
                            "hover:no-underline text-card-foreground/80 hover:text-primary text-xs flex items-center ",
                            item.active && "text-primary font-semibold",
                          )}
                          to={item.active ? "#" : item.url}
                        >
                          {item.label}
                        </RouterLink>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator className="" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
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
