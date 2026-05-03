"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ar, fr } from "date-fns/locale";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useMarkAsRead, useNotifications } from "../api/notification.api";
import { Notification, NotificationType } from "../notification.type";
import { notificationConfig } from "./notification.dropdown";

type NotificationDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNotificationClick?: (notification: Notification) => void;
};

export const NotificationDrawer = ({
  isOpen,
  onOpenChange,
  onNotificationClick,
}: NotificationDrawerProps) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const notifications = data?.data?.items || [];
  const locale = i18n.language === "ar" ? ar : fr;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full max-w-md" dir={i18n.dir()}>
        <DrawerHeader className="border-b">
          <DrawerTitle className="ltr:text-left rtl:text-right">
            {t("notifications.all_title", "All Notifications")}
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex h-full items-center justify-center p-8">
              <Spinner variant="primary" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification: Notification) => {
                const Config =
                  notificationConfig[
                    notification.data.type as NotificationType
                  ] || notificationConfig.default;
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex ltr:flex-row rtl:flex-row-reverse  gap-2 px-4 py-3 transition-colors hover:bg-muted/50 cursor-pointer border-b last:border-0",
                      !notification.read_at && "bg-primary/5",
                    )}
                    onClick={() => {
                      if (onNotificationClick) {
                        onNotificationClick(notification);
                      } else {
                        if (!notification.read_at) {
                          markAsRead(notification.id);
                        }
                        if (notification.data.type === "profile_completed") {
                          const userId = notification.data?.user_id;
                          if (userId) {
                            router.push(paths.admin.users.verify.route(userId));
                          }
                        }
                      }
                      onOpenChange(false);
                    }}
                  >
                    <div
                      className={cn(
                        "mt-1 flex size-10 shrink-0 items-center justify-center rounded-full",
                        Config.color,
                      )}
                    >
                      <Config.icon className="size-5" />
                    </div>
                    <div className="flex flex-col w-full gap-1 overflow-hidden ltr:text-left rtl:text-right">
                      <div className="flex items-center justify-between ltr:flex-row rtl:flex-row-reverse ">
                        <p className="truncate text-base font-semibold ltr:text-left rtl:text-right">
                          {t(
                            `notifications.type.${notification.data.type}.title`,
                          )}
                        </p>
                        {!notification.read_at && (
                          <span className="size-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 ltr:text-left rtl:text-right">
                        {t(
                          `notifications.type.${notification.data.type}.body`,
                          { name: notification.data.full_name },
                        )}
                      </p>
                      <span className="text-xs text-muted-foreground/70 ltr:text-left rtl:text-right">
                        {notification.created_at &&
                          formatDistanceToNow(
                            new Date(notification.created_at),
                            {
                              addSuffix: true,
                              locale,
                            },
                          )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-[50vh] flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Bell className="mb-4 size-12 opacity-20" />
              <p className="text-lg">
                {t("notifications.empty", "No notifications yet")}
              </p>
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
