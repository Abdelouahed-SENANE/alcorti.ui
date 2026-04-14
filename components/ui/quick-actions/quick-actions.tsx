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
import { useTranslation } from "react-i18next";
import { Spinner } from "../spinner";
import { useAuthorization } from "@/lib/auth";

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
  role?: string;
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

export const QuickActions = ({
  id,
  entity,
  actions,
  onAction,
}: EntityActionsProps) => {
  const { hasRole } = useAuthorization();
  const filteredActions = actions.filter((action) =>
    action.role ? hasRole({ role: action.role }) : true,
  );

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
          ({ label, value, icon, disabled = false, render }) => {
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
                  "group flex rtl:flex-row-reverse items-center gap-2 text-sm cursor-pointer rounded-none transition-colors px-3 py-2",
                  disabled &&
                    "disabled:opacity-50! disabled:cursor-not-allowed!",
                  "hover:bg-input/80! hover:text-card-foreground text-card-foreground/70",
                )}
              >
                {disabled ? (
                  <>
                    {<Spinner size="sm" variant="primary" />}
                    <span className="">{t("global.loading")}</span>
                  </>
                ) : (
                  <>
                    {icon && <span>{icon}</span>}
                    <span className="">{label}</span>
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
