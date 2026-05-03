"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { paths } from "@/config/paths";
import { useDisclosure } from "@/hooks/use-disclosure";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ar, fr } from "date-fns/locale";
import { Bell, CheckCheck, Container, HandHelping, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { OrderView } from "../../shipments/components/orders/order.view";
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotificationCheck,
  useNotifications,
} from "../api/notification.api";
import { Notification, NotificationType } from "../notification.type";
import { NotificationDrawer } from "./notification.drawer";

export const notificationConfig: Record<NotificationType, { icon: any; color: string }> = {
  profile_completed: { icon: UserCheck, color: "text-success bg-success/10" },
  offer_submitted: { icon: HandHelping, color: "text-blue-600 bg-blue-400/10" },
  offer_accepted_by_admin: { icon: CheckCheck, color: "text-success bg-success/10" },
  offer_accepted_by_client: { icon: CheckCheck, color: "text-success bg-success/10" },
  order_created: {
    icon: Container,
    color: "text-primary bg-primary/10",
  },
  order_assigned: {
    icon: Container,
    color: "text-blue-600 bg-blue-400/10",
  },
  default: { icon: Bell, color: "text-primary bg-primary/10" },
  order_published: {
    icon: Container,
    color: "text-primary bg-primary/10",
  },
};

export const NotificationDropdown = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const {
    isOpen: isOrderOpen,
    toggle: toggleOrder,
    close: closeOrder,
  } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    toggle: toggleDrawer,
    close: closeDrawer,
  } = useDisclosure();
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(
    null,
  );

  const { data: checkData } = useNotificationCheck();
  const unreadCount = checkData?.data?.unread_count ?? 0;

  const { data: listData, isLoading } = useNotifications(10, {
    enabled: open,
  });
  const notifications = listData?.data?.items || [];

  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

  const locale = i18n.language === "ar" ? ar : fr;

  const handleNotificationClick = React.useCallback((notification: Notification) => {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
    if (notification.data.type === "profile_completed") {
      const userId = notification.data?.user_id;
      if (userId) {
        router.push(paths.admin.users.verify.route(userId));
      }
    } else if (notification.data?.order_id) {
      setSelectedOrderId(notification.data.order_id);
      toggleOrder();
    }
    setOpen(false);
  }, [markAsRead, router, toggleOrder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="plain"
          size="icon"
          className="relative size-10 rounded-full bg-transparent text-primary/80 hover:bg-primary/10 hover:text-primary"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute right-1.5 top-0.5 size-4.5 flex items-center justify-center p-0.5 text-[12px] rounded-full border-2 border-card"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-90 p-0 overflow-hidden bg-card"
        align="end"
        sideOffset={8}
        dir={i18n.dir()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
          <h4 className="text-sm font-semibold">
            {t("notifications.title", "Notifications")}
          </h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-primary hover:text-primary-hover hover:bg-primary/5"
              onClick={() => markAllAsRead()}
              disabled={isMarkingAll}
            >
              {isMarkingAll ? (
                <Spinner size="sm" />
              ) : (
                <CheckCheck className="ltr:mr-1 rtl:ml-1 size-3.5" />
              )}
              {t("notifications.mark_all_read", "Mark all as read")}
            </Button>
          )}
        </div>

        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="flex ltr:flex-row rtl:flex-row-reverse gap-1 h-full items-center justify-center p-8">
              <Spinner size="xs" variant="primary" />
              {t("global.loading", "Loading...")}
            </div>
          ) : notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification: Notification) => {
                const Config =
                  notificationConfig[notification.data.type as NotificationType] ||
                  notificationConfig.default;
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex ltr:flex-row rtl:flex-row-reverse gap-2 px-4 py-3 transition-colors hover:bg-accent/50 cursor-pointer border-b last:border-0",
                      !notification.read_at && "bg-primary/5",
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                        Config.color,
                      )}
                    >
                      <Config.icon className="size-4" />
                    </div>
                    <div className="flex flex-col w-full gap-1 overflow-hidden ltr:text-left rtl:text-right">
                      <div className="flex items-center justify-between ltr:flex-row rtl:flex-row-reverse ">
                        <p className="truncate text-sm font-medium">
                          {t(
                            `notifications.type.${notification.data.type}.title`,
                          )}
                        </p>
                        {!notification.read_at && (
                          <span className="size-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-2 text-wrap ltr:text-left rtl:text-right">
                        {t(
                          `notifications.type.${notification.data.type}.body`, { name: notification.data.full_name }
                        )}
                      </p>
                      <span className="text-[13px] text-foreground/80 ltr:text-left rtl:text-right">
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
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-foreground/70">
              <Bell className="mb-1 size-9 text-foreground/20" />
              <p className="text-md">
                {t("notifications.empty", "No notifications yet")}
              </p>
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-2">
          <Button
            variant="ghost"
            className="w-full h-8 text-xs text-foreground"
            size="sm"
            onClick={() => {
              toggleDrawer();
              setOpen(false);
            }}
          >
            {t("notifications.view_all", "View all notifications")}
          </Button>
        </div>
      </PopoverContent>
      {selectedOrderId && (
        <OrderView
          id={selectedOrderId}
          isOpen={isOrderOpen}
          onOpenChange={(val) => !val && closeOrder()}
        />
      )}
      <NotificationDrawer
        isOpen={isDrawerOpen}
        onOpenChange={(val) => !val && closeDrawer()}
        onNotificationClick={handleNotificationClick}
      />
    </Popover>
  );
};
