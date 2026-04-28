"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer/drawer";
import { Spinner } from "@/components/ui/spinner";
import { ContactCard } from "@/features/users/components/contact.card";
import { Check, PhoneCall, User, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useOrderOffers } from "../../api/offers/list.offers";
import { ShipmentOfferSubmitted } from "../../shipment.type";
import { OfferDecisionConfirmation } from "./offer-decission.confirmation";

interface OrderOffersViewProps {
  orderId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderOffersView = ({
  isOpen,
  orderId,
  onOpenChange,
}: OrderOffersViewProps) => {
  const { t } = useTranslation();
  const { data: offersQuery, isLoading } = useOrderOffers(orderId, isOpen);
  const offers = offersQuery?.data || [];

  const sortedOffers = [...offers].sort((a, b) => {
    if (a.status === "accepted" && b.status !== "accepted") return -1;
    if (b.status === "accepted" && a.status !== "accepted") return 1;
    return 0;
  });

  const acceptedOffers = sortedOffers.filter(
    (offer) => offer.status === "accepted",
  );
  const pendingOffers = sortedOffers.filter(
    (offer) => offer.status !== "accepted" && offer.status !== "cancelled",
  );
  const cancelledOffers = sortedOffers.filter(
    (offer) => offer.status === "cancelled",
  );

  const hasAcceptedOffer = offers.some((offer) => offer.status === "accepted");

  if (isLoading) {
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

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full max-w-lg rounded-none border-l overflow-hidden">
        <DrawerHeader className="border-b p-4">
          <DrawerTitle className="text-xl font-semibold ltr:text-left rtl:text-right">
            {t("shipments.offers.title", "Order Offers")}
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar ">
          <div className="space-y-2">
            {offers.length > 0 ? (
              <div className="space-y-6">
                {acceptedOffers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-md font-semibold text-card-foreground">
                      {t("shipments.offers.accepted_title", "Accepted Offer")}
                    </p>
                    {acceptedOffers.map((offer) => (
                      <OfferItem
                        key={offer.id}
                        offer={offer}
                        orderId={orderId}
                        hasAcceptedOffer={hasAcceptedOffer}
                      />
                    ))}
                  </div>
                )}

                {pendingOffers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-md font-semibold text-card-foreground">
                      {t("shipments.offers.pending_title", "Pending Offers")}
                    </p>
                    {pendingOffers.map((offer) => (
                      <OfferItem
                        key={offer.id}
                        offer={offer}
                        orderId={orderId}
                        hasAcceptedOffer={hasAcceptedOffer}
                      />
                    ))}
                  </div>
                )}

                {cancelledOffers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-md font-semibold text-muted-foreground">
                      {t(
                        "shipments.offers.cancelled_title",
                        "Cancelled Offers",
                      )}
                    </p>
                    {cancelledOffers.map((offer) => (
                      <OfferItem
                        key={offer.id}
                        offer={offer}
                        orderId={orderId}
                        hasAcceptedOffer={hasAcceptedOffer}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-xl bg-muted/20">
                <div className="size-12 rounded-full bg-primary/5 flex items-center justify-center text-primary/50 mb-3">
                  <User className="size-6" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {t("shipments.offers.empty.title", "No offers yet")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t(
                    "shipments.offers.empty.desc",
                    "Offers from shippers will appear here once they are submitted.",
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const OfferItem = ({
  offer,
  orderId,
  hasAcceptedOffer,
}: {
  offer: ShipmentOfferSubmitted;
  orderId: string;
  hasAcceptedOffer: boolean;
}) => {
  const { t } = useTranslation();

  const isAccepted = offer.status === "accepted";
  const isCancelled = offer.status === "cancelled";
  const isPending = offer.status === "pending";

  let cardClasses =
    "p-4 rounded-xl border flex flex-col gap-3 transition-all duration-300 relative ";
  if (isAccepted) {
    cardClasses +=
      "border-primary bg-primary text-secondary shadow-md overflow-hidden";
  } else if (isCancelled) {
    cardClasses += "border-border/50 bg-muted/30 opacity-60 grayscale";
  } else {
    cardClasses += "border-border bg-card";
  }

  console.log(offer);

  return (
    <>
      <div className={cardClasses}>
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2 min-w-0 ">
            <Avatar
              className={`size-8 rounded-full flex items-center justify-center  ${"bg-secondary"}`}
            >
              <AvatarImage
                src={offer.shipper.avatar}
                className="size-full object-cover"
              />
              <AvatarFallback
                className={isAccepted ? "bg-secondary text-primary" : ""}
              >
                {offer.shipper.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <h4 className="font-bold text-sm flex items-center flex-wrap gap-1">
                <span className="truncate max-w-[150px]">
                  {offer?.shipper?.full_name}
                </span>
                <Badge
                  className={`text-xs font-semibold px-3 py-0 h-6 ${
                    isPending ? "text-primary/70 bg-primary/10" : ""
                  } ${isAccepted ? "bg-secondary text-primary hover:bg-secondary/80" : ""}`}
                >
                  {t(`global.status.${offer.status}` as any, offer.status)}
                </Badge>
              </h4>
            </div>
          </div>

          {!isCancelled && (
            <div className="flex items-center justify-end gap-1.5 shrink-0 ltr:pl-2 rtl:pr-2">
              {isAccepted && (
                <ContactCard
                  userId={offer?.shipper?.id!}
                  title={t(
                    "shipments.offers.shipper_info",
                    "Shipper Information",
                  )}
                  trigger={
                    <Button
                      className={`text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/90`}
                    >
                      <PhoneCall className="size-3 ltr:mr-1 rtl:ml-1" />
                      {t("users.actions.contact_shipper")}
                    </Button>
                  }
                />
              )}

              <OfferDecisionConfirmation
                id={offer.id}
                status="cancelled"
                trigger={
                  <Button
                    variant={isAccepted ? "destructive" : "outline"}
                    size="sm"
                    className="h-8 gap-1.5 px-3 text-xs"
                  >
                    <X className="size-3.5" />{" "}
                    {t("global.actions.cancel", "Cancel")}
                  </Button>
                }
              />

              {isPending && !hasAcceptedOffer && (
                <OfferDecisionConfirmation
                  id={offer.id}
                  status="accepted"
                  trigger={
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 bg-success hover:bg-success/90 text-white gap-1.5 px-3 text-xs"
                    >
                      <Check className="size-3.5" />
                      {t("global.actions.accept", "Accept")}
                    </Button>
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
