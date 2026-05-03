"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/dialog/confirmation/confirmation-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer/drawer";
import { DynamicIcon } from "@/components/ui/icons/dynamic-icon";
import { Spinner } from "@/components/ui/spinner";
import { DistanceViewer } from "@/components/viewers/distance/distance-viewer";
import i18n from "@/config/i18n";
import { ContactCard } from "@/features/users/components/contact.card";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useAuthorization } from "@/lib/auth";
import {
  cn,
  formatDate,
  formatDateTime,
  resolveLocaleValue,
} from "@/lib/utils";
import { calculatePrice, calculateRoadDistance, RouteResult } from "@/services";
import {
  Calendar,
  CheckCircle,
  Info,
  MapPin,
  Navigation,
  Package,
  Route,
  Send,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSubmitOffer } from "../../api/offers/submit.offer";
import { useOrderDetails } from "../../api/orders/details.order";
import { useUpdateOrderStatus } from "../../api/orders/update.order-status";
import {
  ShipmentOrder,
  ShipmentOrderItem,
  ShipmentOrderTimeline,
} from "../../shipment.type";
import { OrderAssignDialog } from "./assign-order.dialog";
import { statusColors } from "./order.card";
interface OrderViewProps {
  id: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderView = ({ id, isOpen, onOpenChange }: OrderViewProps) => {
  const { t } = useTranslation();
  const lang = i18n.language;
  const { hasRole } = useAuthorization();
  const orderQuery = useOrderDetails({ id });
  const assignDialog = useDisclosure();

  const order = orderQuery.data?.data;

  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (order) {
      calculateRoadDistance(
        { lat: order.origin.lat, lng: order.origin.lng },
        { lat: order.destination.lat, lng: order.destination.lng },
      ).then((result: RouteResult | null) => {
        if (result) {
          setDistance(result.distanceKm);
        }
      });
    }
  }, [order]);

  if (!order) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center dark:bg-black/60 bg-white/60 ">
        <div className="flex items-center gap-2">
          <Spinner size="sm" variant="primary" />
          <p className="text-sm font-medium dark:text-white text-black">
            {t("global.loading")}
          </p>
        </div>
      </div>
    );
  }

  const categoryName = resolveLocaleValue(order.category, lang);
  const originName = resolveLocaleValue(order.origin, lang);
  const destinationName = resolveLocaleValue(order.destination, lang);

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full max-w-xl rounded-none border-l overflow-hidden">
        <DrawerHeader className="border-b p-4">
          <DrawerTitle className="text-xl font-semibold ltr:text-left rtl:text-right">
            {t("shipments.orders.detail.title", "Order Details")}
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar ">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-secondary text-secondary-foreground  border border-primary/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-background/20 backdrop-blur-md flex items-center justify-center text-primary shadow-inner">
                    <Wallet className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-secondary-foreground/60 leading-none mb-1">
                      {t("shipments.form.summary.estimated_price")}
                    </p>
                    <p className="text-xs font-medium text-secondary-foreground/40">
                      {t("shipments.form.summary.confirmation_notice")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary tracking-tighter">
                      {calculatePrice(distance!)}
                    </span>
                    <span className="text-[10px] font-black text-primary/80 uppercase tracking-widest">
                      {t("shipments.form.summary.mad")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Contact Information */}
            {order.shipper && (
              <ContactCard
                user={order.shipper}
                title={t(
                  "shipments.offers.shipper_info",
                  "Shipper Information",
                )}
              />
            )}
            {order.client && (
              <ContactCard
                user={order.client}
                title={t("users.contact.client", "Client Information")}
              />
            )}
            {/* Header Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {order.category?.icon_name && (
                    <Badge variant={"default"} className="font-bold text-xs">
                      <DynamicIcon
                        name={order.category.icon_name}
                        className="size-5"
                      />
                      {categoryName}
                    </Badge>
                  )}
                </div>
                <Badge
                  className={cn(
                    "font-bold text-xs",
                    statusColors[order.status],
                  )}
                >
                  {t(`shipments.orders.status.${order.status}`)}
                </Badge>
              </div>
              <p className="text-sm text-foreground/70 font-medium leading-relaxed text-pretty ">
                {order.description || t("global.no_description")}
              </p>
            </div>

            {/* Timeline / Dates */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-0.5 text-base  font-semibold">
                <Calendar className="size-5 text-primary " />
                {t("shipments.form.summary.available_between")}
              </span>
              <p className="text-base font-medium text-primary">
                {formatDate(order.from_date, lang)} -{" "}
                {formatDate(order.to_date, lang)}
              </p>
            </div>

            {/* Route & Map */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-base font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <Route className="size-5 text-primary" />
                  {t("shipments.form.summary.route")}
                </div>
                <div className="px-2 py-1 bg-primary flex items-center gap-1  text-primary-foreground rounded-md text-sm medium border border-primary/20">
                  <Navigation className="size-4" />
                  {distance} {t("global.km")}
                </div>
              </div>

              <div className="relative space-y-2 ">
                <div className="space-y-1.5 flex-1">
                  <h3 className="flex relative flex-col items-start text-md font-bold tracking-tight text-foreground truncate">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/15 text-primary rounded-full size-8 flex items-center justify-center">
                        <MapPin className="size-4" />
                      </span>
                      <span className="truncate flex flex-col max-w-[260px]">
                        <span className="text-xs text-foreground/70 font-bold">
                          {t("shipments.form.origin.label")}
                        </span>
                        {resolveLocaleValue(order?.origin, lang)}
                      </span>
                    </div>

                    <div className="min-h-4 bg-input w-0.5 mx-4 my-1"></div>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="bg-primary/15 text-primary rounded-full size-8 flex items-center justify-center">
                        <MapPin className="size-4" />
                      </span>
                      <span className="truncate flex flex-col max-w-[260px]">
                        <span className="text-xs text-foreground/70 font-bold">
                          {t("shipments.form.destination.label")}
                        </span>
                        {resolveLocaleValue(order?.destination, lang)}
                      </span>
                    </div>
                  </h3>
                </div>

                <div className="h-[250px] rounded-xl overflow-hidden border border-border/60 shadow-inner">
                  <DistanceViewer
                    origin={{
                      lat: order.origin.lat,
                      lng: order.origin.lng,
                      label: originName,
                    }}
                    destination={{
                      lat: order.destination.lat,
                      lng: order.destination.lng,
                      label: destinationName,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <Package className="size-5 text-primary" />
                  {t("shipments.form.items.label")}
                </div>
                <Badge variant="secondary" className="font-black">
                  {order.items.length} {t("global.count")}
                </Badge>
              </div>

              <div className="grid gap-3">
                {order.items.map((item, index) => (
                  <OrderItem key={index} item={item} t={t} />
                ))}
              </div>
            </div>

            {/* Timelines Section */}
            {hasRole({ role: "client" }) && order.timelines && (
              <div className="">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <Package className="size-5 text-primary" />
                    {t("shipments.orders.timelines.title")}
                  </div>
                </div>

                <div className="relative space-y-0 ">
                  {order.timelines?.map((timeline, index) => (
                    <TimelineItem
                      key={index}
                      timeline={timeline}
                      isLast={index === order.timelines!.length - 1}
                    />
                  ))}
                </div>
              </div>
            )}
            <OrderActions order={order} onAssignOpen={assignDialog.open} />
          </div>

          <OrderAssignDialog
            orderId={id}
            isOpen={assignDialog.isOpen}
            onOpenChange={(val) => !val && assignDialog.close()}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const OrderItem = ({ item, t }: { item: ShipmentOrderItem; t: any }) => {
  return (
    <div className="group flex items-start justify-between rounded-lg p-2  bg-primary/2 border border-primary/20">
      <div className="flex items-center gap-2">
        {item.image_url ? (
          <div className="relative size-8 rounded-lg overflow-hidden bg-muted border border-border shadow-sm shrink-0">
            <Image
              src={item.image_url}
              alt={item?.description || "Item image"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : (
          <div className="size-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0">
            <Package className="size-5 opacity-60" />
          </div>
        )}
        <div className="flex flex-col gap-0.5 py-0.5">
          <span className="text-foreground font-semibold tracking-tight text-sm line-clamp-1 max-w-[200px] md:max-w-md">
            {item.description || "-"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {item.weight && (
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/10  tracking-wider">
              {t("shipments.form.items.weight_summary", {
                weight: item.weight,
              })}
            </span>
          )}
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/10  tracking-wider">
            {t("shipments.form.items.dims_summary", {
              length: item.length,
              width: item.width,
              height: item.height,
            })}
          </span>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/10  tracking-wider">
            {t("shipments.form.items.volume.display", {
              volume: Math.round(item.volume * 100) / 100,
              unit: item.unit,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({
  timeline,
  isLast,
}: {
  timeline: ShipmentOrderTimeline;
  isLast: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative flex gap-x-4 p-2">
      {/* Visual Line and Circle */}
      <div
        className={cn(
          "relative flex flex-col items-center",
          !isLast &&
            "after:absolute after:top-[10px] after:bottom-[-26px] after:w-0.5 after:bg-primary/20",
        )}
      >
        <div className="relative z-10 size-5 flex items-center justify-center rounded-full bg-background border-2 border-primary shadow-sm shadow-primary/20">
          <div className="size-1.5 rounded-full bg-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-7 ">
        <h5 className="font-bold  text-foreground flex items-center gap-2  tracking-tight leading-none">
          <Badge
            variant="outline"
            className={statusColors[timeline.new_status]}
          >
            {t(`shipments.orders.status.${timeline.new_status}`)}
          </Badge>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/10 tracking-widest">
            {formatDateTime(timeline.created_at, i18n.language)}
          </span>
        </h5>
      </div>
    </div>
  );
};

const OrderActions = ({
  order,
  onAssignOpen,
}: {
  order: ShipmentOrder;
  onAssignOpen: () => void;
}) => {
  const { t } = useTranslation();
  const { hasRole } = useAuthorization();
  const updateStatusMutation = useUpdateOrderStatus();
  const submitOfferMutation = useSubmitOffer();

  if (!order.abilities) return null;

  const showAdminActions =
    hasRole({ role: "admin" }) &&
    (order.abilities.can_publish ||
      order.abilities.can_assign ||
      order.abilities.can_reject);

  const showShipperActions =
    order.abilities.can_submit_offer ||
    order.abilities.shipper_already_placed_offer;

  if (!showAdminActions && !showShipperActions) return null;

  return (
    <div className="flex flex-wrap items-center justify-end gap-1 py-4 mt-4 border-t border-border/60">
      {hasRole({ role: "admin" }) && order.abilities.can_reject && (
        <ConfirmationDialog
          title={t("shipments.orders.modals.reject.title", "Reject Order")}
          body={t(
            "shipments.orders.modals.reject.description",
            "Are you sure you want to reject this order? This action cannot be undone.",
          )}
          icon="danger"
          isDone={updateStatusMutation.isSuccess}
          triggerButton={
            <Button className=" font-medium bg-destructive hover:bg-destructive/90  text-white  active:scale-95 flex items-center gap-1">
              <X className="size-4" />
              {t("global.actions.reject", "Reject")}
            </Button>
          }
          confirmButton={
            <Button
              variant="destructive"
              className="font-bold"
              disabled={updateStatusMutation.isPending}
              onClick={() =>
                updateStatusMutation.mutate({
                  id: order.id,
                  payload: { status: "cancelled" },
                })
              }
            >
              {updateStatusMutation.isPending
                ? t("global.loading", "Loading...")
                : t("global.actions.confirm", "Confirm")}
            </Button>
          }
          cancelButton={(onCancel) => (
            <Button variant="outline" onClick={onCancel}>
              {t("global.actions.cancel", "Cancel")}
            </Button>
          )}
        />
      )}

      {hasRole({ role: "admin" }) && order.abilities.can_publish && (
        <ConfirmationDialog
          title={t("shipments.orders.modals.publish.title", "Publish Order")}
          body={t(
            "shipments.orders.modals.publish.description",
            "Are you sure you want to publish this order? This will make it visible to shippers.",
          )}
          icon="info"
          isDone={updateStatusMutation.isSuccess}
          triggerButton={
            <Button className=" font-medium bg-success hover:bg-success/90 text-white active:scale-95 flex items-center  gap-1">
              <Send className="size-4" />
              {t("global.actions.publish", "Publish")}
            </Button>
          }
          confirmButton={
            <Button
              variant="default"
              className="font-bold bg-primary hover:bg-primary/90"
              disabled={updateStatusMutation.isPending}
              onClick={() =>
                updateStatusMutation.mutate({
                  id: order.id,
                  payload: { status: "published" },
                })
              }
            >
              {updateStatusMutation.isPending
                ? t("global.loading", "Loading...")
                : t("global.actions.confirm", "Confirm")}
            </Button>
          }
          cancelButton={(onCancel) => (
            <Button variant="outline" onClick={onCancel}>
              {t("global.actions.cancel", "Cancel")}
            </Button>
          )}
        />
      )}

      {hasRole({ role: "admin" }) && order.abilities.can_assign && (
        <Button
          variant="default"
          className=" font-medium bg-primary text-primary-foreground hover:primary/80 active:scale-95 flex items-center gap-1"
          onClick={onAssignOpen}
        >
          <CheckCircle className="size-4" />
          {t("global.actions.assign", "Assign")}
        </Button>
      )}

      {hasRole({ role: "shipper" }) && (
        <div className="flex flex-1 ">
          {order.abilities.shipper_already_placed_offer ? (
            <Button
              variant="default"
              className="font-medium bg-primary/80 text-primary-foreground flex items-center gap-1"
              disabled
            >
              <CheckCircle className="size-4" />
              {t(
                "shipments.orders.actions.submitted_offer",
                "Offer Already Submitted",
              )}
            </Button>
          ) : order.abilities.offers_limit_reached ? (
            <div className="flex flex-1 text-sm font-medium items-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md">
              <Info className="size-4" />
              {t(
                "shipments.orders.actions.limit_reached",
                "Offers Limit Reached",
              )}
            </div>
          ) : (
            <ConfirmationDialog
              icon="info"
              title={t("shipments.orders.modals.submit_offer.title")}
              body={t("shipments.orders.modals.submit_offer.description")}
              isDone={submitOfferMutation.isSuccess}
              confirmButton={
                <Button
                  onClick={() => {
                    submitOfferMutation.mutate({ orderId: order.id });
                  }}
                  disabled={submitOfferMutation.isPending}
                >
                  {t("global.actions.confirm", "Confirm")}
                </Button>
              }
              cancelButton={(onCancel) => (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={submitOfferMutation.isPending}
                >
                  {t("global.actions.cancel")}
                </Button>
              )}
              triggerButton={
                <Button
                  variant="default"
                  className="font-medium bg-primary text-primary-foreground hover:bg-primary/80 active:scale-95 flex items-center gap-1"
                >
                  <CheckCircle className="size-4" />
                  {t("global.actions.submit_offer", "Submit Offer")}
                </Button>
              }
            />
          )}
        </div>
      )}
    </div>
  );
};
