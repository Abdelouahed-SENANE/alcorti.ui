"use client";

import logoSm from "@/assets/fallback-logo.svg";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import { Car, Layout, MapPin, Users } from "lucide-react";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Sidebar, useSidebar } from "../../ui/sidebar";

// ============================================================
// TYPES
// ============================================================
type MenuItem = {
  label: string;
  url: string;
  icon?: React.ReactNode;
  excludePaths?: string[];
};

type GroupMenu = {
  group: string;
  items: MenuItem[];
};

// ============================================================
// SHARED MENU FILTER UTILITY (works for any menu level)
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
// ADMIN MENU CONFIG
// ============================================================
const ADMIN_MENU = (t: (key: string) => string) =>
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
        {
          label: t("navigation.vehicles"),
          url: paths.admin.vehicles.route(),
          icon: <Car className="size-4" />,
        },
        {
          label: t("navigation.locations"),
          url: paths.admin.locations.route(),
          icon: <MapPin className="size-4" />,
        },
      ],
    },
  ] satisfies GroupMenu[];

export const DashboardSidebar = () => {
  const { t } = useTranslation();
  const { isCollapsed } = useSidebar();

  const rawGroups = ADMIN_MENU(t);
  const groups = filterMenu(rawGroups);

  return (
    <Sidebar.Root
      className={cn(
        "transition-[transform,width] duration-200 ease-in-out",
        isCollapsed ? "w-(--sidebar-collapsed-width)" : "w-(--sidebar-width)",
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
                {group.items.map((item, itemIndex) => (
                  <Sidebar.Link
                    className=" transition-colors text-card-foreground/80"
                    key={itemIndex}
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
  );
};
