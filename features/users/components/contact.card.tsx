import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useUserContact } from "../api/user.contact";

interface ConatctCardProps {
  userId: string;
  trigger?: React.ReactNode;
  title?: string;
}

export const ContactCard = ({ userId, trigger, title }: ConatctCardProps) => {
  const { t } = useTranslation();
  const { data, isLoading } = useUserContact({ id: userId });
  const profile = data?.data;

  const displayUser = profile
    ? {
        full_name: `${profile.first_name} ${profile.last_name}`,
        avatar: profile.avatar,
        email: profile.email,
        phone: profile.phone,
      }
    : null;

  const InnerContent = () => {
    if (isLoading || !displayUser) {
      return (
        <div className="flex flex-col items-center gap-4 py-6">
          <Skeleton className="size-24 rounded-full" />
          <div className="space-y-2 flex flex-col items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <Avatar className="size-24 ring-4 ring-primary/10 ring-offset-2">
          <AvatarImage src={displayUser.avatar} className="object-cover" />
          <AvatarFallback className="text-3xl bg-primary/10 text-primary">
            {displayUser.full_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            {displayUser.full_name}
          </h3>

          <div className="flex flex-col items-center gap-1.5 mt-2">
            {displayUser.email && (
              <div className="flex items-center text-base font-medium ltr:justify-center rtl:justify-start gap-2 text-card-foreground/60 ">
                <Mail className="size-5" />
                <span dir="ltr">{displayUser.email}</span>
              </div>
            )}

            {displayUser.phone && (
              <div className="flex items-center text-base font-medium ltr:justify-center rtl:justify-start gap-2 text-card-foreground/60 ">
                <Phone className="size-5" />
                <span dir="ltr">{displayUser.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!trigger) {
    return <InnerContent />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {title || t("users.profile.title", "User Profile")}
          </DialogTitle>
        </DialogHeader>
        <InnerContent />
      </DialogContent>
    </Dialog>
  );
};
