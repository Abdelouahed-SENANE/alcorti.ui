"use client";
import logoSm from "@/assets/fallback-logo.svg";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import { Layout, Users } from "lucide-react";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Sidebar, useSidebar } from "../ui/sidebar";
import { Topbar } from "../ui/topbar/topbar";

// ============================================================
// 1) TYPES
// ============================================================
type GroupMenu = {
  group: string;
  items: MenuItem[];
};

type MenuItem = {
  label: string;
  url: string;
  icon?: React.ReactNode;
  excludePaths?: string[];
};

// ============================================================
// 2) SHARED MENU FILTER UTILITY (works for any menu level)
// ============================================================
function filterMenu(groups: GroupMenu[]): GroupMenu[] {
  return groups
    .map((group) => {
      const filteredItems = group.items
        .map((item) => {
          return item;
        })
        .filter(Boolean) as MenuItem[];

      // If group becomes empty, we filter it out
      if (filteredItems.length === 0) return null;

      return { ...group, items: filteredItems };
    })
    .filter(Boolean) as GroupMenu[];
}

// ============================================================
// 3) ADMIN MENU CONFIG
// ============================================================
const ADMIN_MENU = (t: any) =>
  [
    {
      group: t("navigation.admin"),
      items: [
        {
          label: t("navigation.dashboard"),
          url: paths.admin.dashboard.route(),
          icon: <Layout className="size-4" />,
        },
        {
          label: t("navigation.users"),
          url: paths.admin.users.route(),
          icon: <Users className="size-4" />,
        },
      ],
    },
  ] satisfies GroupMenu[];

// ============================================================
// 4) TENANT MENU CONFIG
// ============================================================

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
  const { t } = useTranslation();
  const { isCollapsed } = useSidebar();

  const rawGroups = ADMIN_MENU(t);

  const groups = filterMenu(rawGroups);

  return (
    <Fragment>
      <div className="min-h-screen w-full overflow-hidden relative bg-background">
        <Sidebar.Root
          className={cn(
            "transition-[transform,width] duration-200 ease-in-out",
            isCollapsed
              ? "w-(--sidebar-collapsed-width)"
              : "w-(--sidebar-width)",
          )}
        >
          <Sidebar.Brand
            url={paths.admin.dashboard.route()}
            pathSmall={logoSm.src}
          />
          <Sidebar.Body>
            {groups.map((group, index) => (
              <Fragment key={index}>
                <Sidebar.Menu className="mb-1">
                  <Sidebar.Item>
                    {group.items.map((item, index) => (
                      <Sidebar.Link
                        className=" transition-colors text-card-foreground/80"
                        key={index}
                        title={item.label}
                        to={item.url}
                        icon={item.icon}
                        excludePaths={item.excludePaths}
                      />
                    ))}
                  </Sidebar.Item>
                </Sidebar.Menu>
              </Fragment>
            ))}
          </Sidebar.Body>
        </Sidebar.Root>
        <main className={cn("flex-1 relative")}>
          <Topbar breadcrumbs={breadcrumbs} />
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
