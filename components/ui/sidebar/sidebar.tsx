"use client";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { forwardRef, HTMLAttributes } from "react";
import { create } from "zustand";
import { Button } from "../button";
import { RouterLink } from "../link";
import { useTranslation } from "react-i18next";

type SidebarStore = {
  isCollapsed: boolean;
  openKey: string | null;
  toggle: () => void;
  setCollapsed: (isCollapsed: boolean) => void;
  setOpenKey: (key: string | null) => void;
};

export const useSidebar = create<SidebarStore>((set, get) => ({
  isCollapsed: false,
  openKey: null,
  toggle: () => set({ isCollapsed: !get().isCollapsed }),
  setCollapsed: (isCollapsed: boolean) => set({ isCollapsed }),
  setOpenKey: (key) => set({ openKey: key }),
}));

const Root = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar();
    return (
      <aside
        ref={ref}
        data-collapsed={isCollapsed}
        className={cn(
          "fixed h-screen flex flex-col z-20 group/sidebar top-0 ltr:border-r rtl:border-l bg-card backdrop-blur-sm ease-in-out transition-[width] duration-300 inset-inline-start-0",
          className,
          isCollapsed
            ? "w-(--sidebar-collapsed) hover:w-(--sidebar-expended)"
            : "w-(--sidebar-expended)",
        )}
        {...props}
      >
        {children}
      </aside>
    );
  },
);

const Separator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ children, className, ...props }, ref) => {
  return (
    <hr
      ref={ref}
      className={cn("w-full h-px bg-sidebar", className)}
      {...props}
    />
  );
});

Separator.displayName = "SidebarSeparator";
export const Label = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, title, ...props }, ref) => {
  const { isCollapsed } = useSidebar();
  return (
    <span
      ref={ref}
      className={cn(
        "text-xs text-sidebar-foreground/60 uppercase mb-2  tracking-wider w-full transition-all duration-200",

        // collapsed → hide, but recover on hover
        isCollapsed
          ? "opacity-0 -translate-x-1 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0"
          : "opacity-100 translate-x-0",

        className,
      )}
      {...props}
    >
      {title}
    </span>
  );
});

Label.displayName = "SidebarLabel";

const Brand = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    pathLight?: string;
    pathDark?: string;
    pathSmall?: string;
    url?: string;
  }
>(({ className, pathDark, pathLight, pathSmall, url, ...props }, ref) => {
  const { isCollapsed } = useSidebar();
  const { t } = useTranslation();
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex items-center px-2 h-15 mb-2 relative ",
        className,
        isCollapsed ? "justify-center" : "justify-start",
      )}
    >
      <RouterLink
        to={url ?? paths.home.root}
        className={
          "flex items-center cursor-pointer group-hover/sidebar:w-full "
        }
      >
        <img className="px-2 py-2 size-10 " src={pathSmall} alt="small-logo" />
        <div
          className={cn(
            "items-center w-full flex",
            isCollapsed && "hidden group-hover/sidebar:block",
          )}
        >
          <h3 className="text-2xl font-semibold text-primary">
            {t("app.name")}
          </h3>
        </div>
      </RouterLink>
    </div>
  );
});

Brand.displayName = "SidebarBrand";

const Body = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex-1 px-2 overflow-y-auto custom-scrollbar", className)}
      role="sidebar-body"
    >
      {children}
    </div>
  );
});

Body.displayName = "SidebarBody";

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  const { isCollapsed, toggle } = useSidebar();
  return (
    <Button
      ref={ref}
      onClick={toggle}
      className={cn(
        "absolute top-4 z-50 px-0.5 text-card-foreground  bg-card border-card  hover:text-white rounded-none   py-1.5 cursor-pointer ",
        className,
        isCollapsed
          ? "left-full rounded-br-sm rounded-tr-sm  border-border border border-l-0"
          : "right-0 rounded-bl-sm rounded-tl-sm border-border border border-r-0",
      )}
      {...props}
    >
      {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
    </Button>
  );
});

Trigger.displayName = "SidebarTrigger";

const Menu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ children, className, ...props }, ref) => {
  return (
    <ul className={cn("", className)} ref={ref} role="list" {...props}>
      {children}
    </ul>
  );
});

Menu.displayName = "SidebarMenu";

const Item = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ children, className, ...props }, ref) => {
  return (
    <li ref={ref} role="item" {...props}>
      {children}
    </li>
  );
});
Item.displayName = "SidebarItem";

interface SubLink {
  title: string;
  to: string;
  icon?: React.ReactNode;
}

interface LinkProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  icon?: React.ReactNode;
  to: string;
  items?: SubLink[];
  excludePaths?: string[];
}

// ...
export const Link = React.forwardRef<HTMLDivElement, LinkProps>(
  (
    { title, icon, to, items = [], excludePaths = [], className, ...props },
    ref,
  ) => {
    const { isCollapsed, setOpenKey, openKey } = useSidebar();
    const hasChildren = items.length > 0;

    const pathname = usePathname();

    const activeSelf = pathname === to;
    const activeNested = pathname.startsWith(to + "/");

    const isExcluded = excludePaths.some(
      (ex) => pathname === ex || pathname.startsWith(ex + "/"),
    );
    const isActive = !isExcluded && (activeSelf || activeNested);

    const isOpen = openKey === to;
    const toggle = (e: React.MouseEvent) => {
      if (!hasChildren) return;
      e.preventDefault();

      if (openKey === to) {
        setOpenKey(null);
        return;
      }
      setOpenKey(to);
    };

    return (
      <div ref={ref} className="w-full">
        <RouterLink
          to={to}
          onClick={(e: React.MouseEvent) => {
            if (!hasChildren) {
              if (isActive) {
                e.preventDefault();
                e.stopPropagation();
              }

              setOpenKey(null);
              return;
            }

            if (hasChildren) {
              toggle(e);
              e.preventDefault();
              return;
            }

            toggle(e);
          }}
          className={cn(
            "group/item flex items-center mb-1 relative py-1.5 px-2 w-full leading-5 text-sm border border-transparent rounded-xs cursor-pointer duration-200 text-sidebar-foreground/70 hover:text-sidebar-foreground",
            isCollapsed
              ? "justify-center gap-0 group-hover/sidebar:gap-2"
              : "justify-start gap-2",
            "before:content-[''] rtl:before:-right-2.5 ltr:before:-left-2.5 before:absolute before:top-0 before:bottom-0 before:w-1.5 before:rounded-[5px] before:border-2 before:border-transparent before:bg-transparent",
            className,
            isActive &&
              "before:border-primary before:bg-primary hover:text-primary text-primary bg-primary/10",
            isOpen &&
              "bg-primary/5 text-primary before:border-primary before:bg-primary ",
          )}
          {...props}
        >
          {icon && <span className="size-4 shrink-0">{icon}</span>}
          <span
            className={cn(
              "font-medium flex-1 whitespace-nowrap transition-all duration-200",
              isActive && "font-semibold",
              isCollapsed
                ? "hidden group-hover/sidebar:inline-block"
                : "inline-block",
            )}
          >
            {title}
          </span>

          {/* chevron: same idea */}
          {hasChildren && (
            <span
              className={cn(
                "transition-transform duration-300",
                isOpen && "rotate-180",
                isCollapsed
                  ? "hidden group-hover/sidebar:inline-flex"
                  : "inline-flex",
              )}
            >
              {isOpen ? (
                <ChevronDown size={14} className="opacity-70" />
              ) : (
                <ChevronRight size={14} className="opacity-70" />
              )}
            </span>
          )}
        </RouterLink>

        {hasChildren && (
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              !isCollapsed && isOpen && "grid-rows-[1fr] opacity-100",
              isCollapsed &&
                isOpen &&
                "group-hover/sidebar:grid-rows-[1fr]  group-hover/sidebar:opacity-100",
              (!isOpen || isCollapsed) && "grid-rows-[0fr] opacity-0 ",
            )}
          >
            <ul
              className="mt-1 overflow-hidden transition-all duration-300 transform"
              style={{
                transform: isOpen ? "translateY(0)" : "translateY(-4px)",
              }}
            >
              {items.map((item) => {
                const subActive = pathname === item.to;

                return (
                  <li key={item.to} className="mb-0.5">
                    <RouterLink
                      to={item.to}
                      onClick={(e: React.MouseEvent) => {
                        if (subActive) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      className={cn(
                        "flex items-center text-sm font-semibold gap-2 py-1.5 rtl:pl-2 rtl:pr-8 ltr:pl-8 ltr:pr-2 text-sidebar-foreground/70 hover:text-sidebar-foreground rounded-sm transition-colors",
                        "relative before:content-[''] before:absolute before:w-1.5 before:h-1.5 before:rounded-full",
                        "before:border-2 before:border-primary/40 ",
                        "ltr:before:left-4 rtl:before:right-4",
                        subActive &&
                          "text-primary before:bg-primary before:border-primary",
                      )}
                    >
                      <span>{item.title}</span>
                    </RouterLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  },
);

Link.displayName = "SidebarLink";

const Footer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="px-4 mb-4"
      aria-description="sidebar footer"
      {...props}
    >
      {children}
    </div>
  );
});

export const Sidebar = {
  Root,
  Separator,
  Label,
  Menu,
  Item,
  Link,
  Footer,
  Brand,
  Trigger,
  Body,
};
