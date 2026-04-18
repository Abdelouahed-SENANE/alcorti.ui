"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "../spinner";

export type QuickActionValue =
  | "view"
  | "delete"
  | "edit"
  | "manage_permissions"
  | "assign_roles"
  | "convert"
  | "download";
export type QuickAction<T = any> = {
  label: string;
  value: QuickActionValue | string;
  icon?: React.ReactNode;
  check?: (entity: T) => boolean;
  disabled?: boolean;
  render?: (id: string, entity: T) => React.ReactNode;
};

type EntityActionsProps<T = any> = {
  id: string;
  entity: T;
  actions: QuickAction<T>[];
  onAction?: (action: QuickAction["value"], id: string) => void;
};

export const QuickActions = <T,>({
  id,
  entity,
  actions,
  onAction,
}: EntityActionsProps<T>) => {
  const filteredActions = useMemo(() => {
    return actions.filter((action) => !action.check || action.check(entity));
  }, [actions, entity]);

  if (!filteredActions || filteredActions.length === 0) return null;
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-card-foreground/80 justify-center hover:bg-primary! hover:text-primary-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="max-w-lg rounded-sm shadow-md p-1 bg-background"
      >
        {filteredActions.map(
          ({
            label,
            value,
            icon,
            disabled = false,
            render,
          }: QuickAction<T>) => {
            if (render) {
              return (
                <div key={value} className="w-full">
                  {render(id, entity)}
                </div>
              );
            }
            return (
              <DropdownMenuItem
                key={value}
                onSelect={(e) => {
                  e.preventDefault();
                  onAction?.(value, id);
                }}
                disabled={disabled}
                className={cn(
                  "group flex rtl:flex-row-reverse items-center gap-1 text-xs! font-medium cursor-pointer rounded-none transition-colors px-2 py-1.5",
                  disabled &&
                    "disabled:opacity-50! disabled:cursor-not-allowed!",
                  "hover:bg-secondary! hover:text-secondary-foreground!  text-card-foreground/80",
                )}
              >
                {disabled ? (
                  <>
                    {<Spinner size="sm" variant="primary" />}
                    <span className="">{t("global.loading")}</span>
                  </>
                ) : (
                  <>
                    {icon && (
                      <span className="transition-colors [&_svg]:text-card-foreground/80! [&_svg]:group-hover:text-secondary-foreground!">
                        {icon}
                      </span>
                    )}
                    <span>{label}</span>
                  </>
                )}
              </DropdownMenuItem>
            );
          },
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
