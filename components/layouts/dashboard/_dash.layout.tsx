"use client";

"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import React, { Fragment } from "react";
import { DashboardSidebar } from "./_dash.sidebar";
import { DashboardTopbar } from "./_dash.topbar";

export const DashLayout = ({
  children,
  title,
  desc,
  actions,
  breadcrumbs = [],
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  desc?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: { label: React.ReactNode; url: string; active?: boolean }[];
}) => {
  const { isCollapsed } = useSidebar();

  return (
    <Fragment>
      <div className="min-h-screen w-full overflow-hidden relative bg-background">
        <DashboardSidebar />
        <main className={cn("flex-1 relative")}>
          <DashboardTopbar breadcrumbs={breadcrumbs} />
          <div
            className={cn(
              "ms-auto transition-[width] h-[calc(100%-var(--topbar-height))] duration-300 flex flex-col w-full mt-(--topbar-height) px-4 py-2",
              isCollapsed
                ? "w-[calc(100%-var(--sidebar-collapsed))]"
                : "w-[calc(100%-var(--sidebar-expended))]",
            )}
          >
            <div className="my-4 space-y-1">
              {title && (
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl text-card-foreground font-medium tracking-normal leading-none">
                      {title}
                    </h1>
                    <p className="text-sm text-foreground/70">{desc}</p>
                  </div>
                  {actions}
                </div>
              )}
            </div>
            {children}
          </div>
        </main>
      </div>
    </Fragment>
  );
};
