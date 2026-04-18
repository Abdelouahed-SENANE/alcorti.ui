"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/form/textarea";
import { toast } from "@/components/ui/toast/use-toast";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "../user.type";

import { env } from "@/config/env";
import { Category } from "../../attachments/attachments.type";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DocumentViewerSkeleton } from "@/components/ui/document-viewer/document-viewer.skeleton";
import { useDisclosure } from "@/hooks/use-disclosure";
import { cn } from "@/lib/utils";
import { Check, Image, Lock, Unlock, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useToggleAccountState } from "../api/account-state";
import { useReviewUser } from "../api/user.review";
import { AccountStateDialog } from "./account-state.dialog";
import { UserReviewSkeleton } from "./user.review.skeleton";

const DocumentViewer = dynamic(
  () =>
    import("@/components/ui/document-viewer/document-viewer").then((m) => ({
      default: m.DocumentViewer,
    })),
  {
    ssr: false,
    loading: () => <DocumentViewerSkeleton />,
  },
);

type UserReviewProps = {
  user: User;
  isFetching: boolean;
};

export const UserReview = ({ user, isFetching }: UserReviewProps) => {
  if (isFetching) {
    return <UserReviewSkeleton />;
  }
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [isRejected, setIsRejected] = useState(false);
  const router = useRouter();

  const { isOpen, open, close } = useDisclosure();

  const toggleAccountState = useToggleAccountState({
    mutationConfig: {
      onSuccess: () => {
        close();
        toast({
          title: user.is_active
            ? t("users.messages.deactivated", "Account Deactivated")
            : t("users.messages.activated", "Account Activated"),
          type: "success",
        });
      },
    },
  });

  const reviewUser = useReviewUser({
    mutationConfig: {
      onSuccess: () => {
        if (isRejected) {
          setReason("");
          toast({
            title: t("users.review.success.rejected", "User Rejected"),
            description: t(
              "users.review.success.rejected_desc",
              "User has been rejected successfully.",
            ),
            type: "success",
          });
        } else {
          toast({
            title: t("users.review.success.approved", "User Approved"),
            description: t(
              "users.review.success.approved_desc",
              "User has been approved successfully.",
            ),
            type: "success",
          });
        }
        router.back();
      },
    },
  });

  const handleApprove = () => {
    reviewUser.mutate({ id: user.id!, status: "approved" });
    setIsRejected(false);
  };

  const handleReject = () => {
    if (!reason.trim()) {
      toast({
        title: t("users.review.errors.reason_required", "Reason Required"),
        description: t(
          "users.review.errors.reason_required_desc",
          "Please provide a reason for rejection.",
        ),
        type: "error",
      });
      return;
    }
    reviewUser.mutate({ id: user.id!, status: "rejected", reason });
    setIsRejected(true);
  };

  const isClient = user.role === "client";
  const isShipper = user.role === "shipper";

  const documents = [
    {
      label: t("users.review.documents.cin_front", "CIN Front"),
      url: `${env.app.storageUrl}${
        user.attachments?.find((a) => a.category === Category.CIN_FRONT)?.path
      }`,
      show: isClient || isShipper,
    },
    {
      label: t("users.review.documents.cin_back", "CIN Back"),
      url: `${env.app.storageUrl}${
        user.attachments?.find((a) => a.category === Category.CIN_BACK)?.path
      }`,
      show: isClient || isShipper,
    },
    {
      label: t("users.review.documents.driver_license", "Driver License"),
      url: `${env.app.storageUrl}${
        user.attachments?.find((a) => a.category === Category.DRIVER_LICENSE)
          ?.path
      }`,
      show: isShipper,
    },
    {
      label: t("users.review.documents.registration", "Registration Document"),
      url: `${env.app.storageUrl}${
        user.attachments?.find(
          (a) => a.category === Category.REGISTRATION_DOCUMENT,
        )?.path
      }`,
      show: isShipper,
    },
  ].filter((doc) => doc.url && doc.show);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex flex-col gap-en w-full lg:w-[500px]">
        <ProfileCard user={user} onToggleStatus={open} />
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-3 mt-2 p-2 bg-card border border-border rounded-md">
            <label className="text-sm font-medium text-card-foreground">
              {t("users.review.rejection_reason_label", "Rejection Reason")}
            </label>
            <Textarea
              placeholder={t(
                "users.review.placeholders.rejection_reason",
                "Reason for rejection...",
              )}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={user.status !== "pending" || reviewUser.isPending}
              registration={{}}
              className="min-h-[120px]"
            />
          </div>
          <div className="flex justify-end  items-center gap-2">
            <Button
              className="gap-1 text-sm"
              variant="destructive"
              onClick={handleReject}
              isLoading={reviewUser.isPending}
              disabled={user.status !== "pending" || reviewUser.isPending}
            >
              <X className="size-4" />
              {t("users.actions.reject", "Refuse")}
            </Button>
            <Button
              className=" gap-1 text-sm"
              variant="success"
              onClick={handleApprove}
              isLoading={reviewUser.isPending}
              disabled={user.status !== "pending" || reviewUser.isPending}
            >
              <Check className="size-4" />
              {t("users.actions.approve", "Confirm")}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 self-stretch flex flex-col gap-4">
        <DocumentViewer
          documents={documents}
          noDocumentsMessage={t(
            "users.review.no_documents",
            "No documents uploaded by this user.",
          )}
        />
      </div>
      <AccountStateDialog
        user={user}
        isOpen={isOpen}
        onClose={close}
        onConfirm={() => toggleAccountState.mutate({ id: user.id! })}
        isLoading={toggleAccountState.isPending}
      />
    </div>
  );
};

const ProfileCard = ({
  user,
  onToggleStatus,
}: {
  user: User;
  onToggleStatus: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Card className="border border-border gap-0 p-0 relative group">
      {user.role !== "admin" && user.status === "approved" && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 size-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onToggleStatus}
        >
          {user.is_active ? (
            <Lock className="size-4" />
          ) : (
            <Unlock className="size-4" />
          )}
        </Button>
      )}
      <CardContent className="pt-2  space-y-4 p-4">
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center  gap-2">
            <Avatar className="size-16 ">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                <Image className="size-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex gap-1 text-sm ltr:text-left rtl:text-right">
                <span>{user.first_name}</span>
                <span className="font-medium">{user.last_name}</span>
              </div>
              <span className="text-xs text-card-foreground/70">
                {user.email}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1">
            <span className="text-card-foreground/70 text-sm capitalize font-medium ">
              {t("users.fields.phone.label", "Phone")}
            </span>
            <span className="font-medium text-sm">{user.phone}</span>
          </div>

          <div className="flex items-center justify-between gap-1">
            <span className="text-card-foreground/70 text-sm capitalize font-medium ">
              {t("users.fields.cin.label", "CIN")}
            </span>
            <span className="font-medium text-sm">{user.cin}</span>
          </div>

          <div className="flex items-center justify-between gap-1">
            <span className="text-card-foreground/70 text-sm capitalize font-medium ">
              {t("users.fields.role.label", "Role")}
            </span>
            <Badge
              className="font-medium text-sm capitalize border-none"
              variant={user.role === "shipper" ? "default" : "secondary"}
            >
              {t(`users.fields.role.${user.role}`, user.role)}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-1">
            <span className="text-card-foreground/70 text-sm capitalize font-medium ">
              {t("users.fields.status.label", "Status")}
            </span>
            <Badge
              className={cn(
                "font-medium text-sm capitalize border-none",
                user.status === "approved"
                  ? "bg-success/10 text-success px-2 py-0.5"
                  : user.status === "rejected"
                    ? "bg-destructive/10 text-destructive px-2 py-0.5"
                    : "bg-warning/10 text-warning px-2 py-0.5",
              )}
            >
              {t(`users.fields.status.${user.status}`, user.status)}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-1">
            <span className="text-card-foreground/70 text-sm capitalize font-medium ">
              {t("users.columns.account_state")}
            </span>
            <Badge
              className="font-medium text-sm capitalize border-none"
              variant={user.is_active ? "success" : "destructive"}
            >
              {user.is_active
                ? t("global.status.active")
                : t("global.status.inactive")}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
