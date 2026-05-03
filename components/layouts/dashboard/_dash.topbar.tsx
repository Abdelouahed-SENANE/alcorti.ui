"use client";

"use client";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/breadcrumb";
import { SwitchLanguage } from "@/components/ui/language/switch-language";
import { RouterLink } from "@/components/ui/link";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme";
import { UserNavgation } from "@/components/ui/user-navigation";
import { NotificationDropdown } from "@/features/notifications/components/notification.dropdown";

type TopbarProps = {
  className?: string;
  breadcrumbs?: { label: React.ReactNode; url: string; active?: boolean }[];
};
export const DashboardTopbar = ({ className, breadcrumbs = [] }: TopbarProps) => {
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
                        {!item.label ? (
                          <Skeleton className="w-20 h-5" />
                        ) : (
                          <RouterLink
                            className={cn(
                              "hover:no-underline text-card-foreground/80 hover:text-primary text-sm flex items-center ",
                              item.active && "text-primary font-semibold",
                            )}
                            to={item.active ? "#" : item.url}
                          >
                            {item.label}
                          </RouterLink>
                        )}
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
          <li>
            <NotificationDropdown />
          </li>
          <li>
            <UserNavgation />
          </li>
        </ul>
      </nav>
    </div>
  );
};
