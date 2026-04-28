"use client";

import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/dialog/confirmation/confirmation-dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast/use-toast";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useOfferDecision } from "../../api/offers/offer.decision";

interface OfferDecisionConfirmationProps {
  id: string;
  status: "accepted" | "cancelled";
  trigger: React.ReactElement;
}

export const OfferDecisionConfirmation = ({
  id,
  status,
  trigger,
}: OfferDecisionConfirmationProps) => {
  const { t } = useTranslation();

  const decisionMutation = useOfferDecision({
    offerId:id,
    mutationConfig: {
      onSuccess: (res) => {
        toast({
          title: t("global.success", "Success"),
          description:
            res.message || t("messages.success", "Action successful"),
          type: "success",
        });
      },
      onError: (err: any) => {
        toast({
          title: t("global.error", "Error"),
          description:
            err.response?.data?.message ||
            t("messages.error", "An error occurred"),
          type: "error",
        });
      },
    },
  });

  const handleConfirm = () => {
    decisionMutation.mutate({ id, status });
  };

  const isAccepted = status === "accepted";

return (
    <ConfirmationDialog
      triggerButton={trigger}
      title={
        isAccepted
          ? t("shipments.offers.confirm_accept_title", "Accept Offer")
          : t("shipments.offers.confirm_cancel_title", "Cancel Offer")
      }
      body={
        isAccepted
          ? t(
              "shipments.offers.confirm_accept_body",
              "Are you sure you want to accept this offer? This will close the order for other shippers.",
            )
          : t(
              "shipments.offers.confirm_cancel_body",
              "Are you sure you want to cancel this offer?",
            )
      }
      icon={isAccepted ? "info" : "danger"}
      isDone={decisionMutation.isSuccess}
      confirmButton={
        <Button
          variant={isAccepted ? "default" : "destructive"}
          onClick={handleConfirm}
          disabled={decisionMutation.isPending}
          className="gap-2"
        >
          {decisionMutation.isPending ? (
            <Spinner size="sm" className="text-current" />
          ) : (
            <Check className="size-4" />
          )}

            {t("global.actions.confirm", "Confirm")}
        </Button>
      }
      cancelButton={(onCancel) => (
        <Button variant="outline" onClick={onCancel}>
          {t("global.actions.back", "Back")}
        </Button>
      )}
    />
  );
};
