import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { ContactInfo } from "../user.type";

interface ContactCardProps {
  user: ContactInfo;
  title?: string;
}

export const ContactCard = ({ user, title }: ContactCardProps) => {
  if (!user) return null;

  const full_name = `${user.first_name} ${user.last_name}`;

  return (
    <Card className="bg-card w-full shadow-none border border-border gap-0 p-4">
      <CardHeader className="p-0 m-0">
        {title && (
          <h4 className="text-sm font-semibold capitalize tracking-wider text-foreground/50 w-full ltr:text-left rtl:text-right">
            {title}
          </h4>
        )}
      </CardHeader>
      <CardContent className="p-0 flex items-center gap-2">
        <Avatar className="size-10 ring-2 ring-primary/10 ring-offset-1 shrink-0">
          <AvatarImage src={user.avatar} className="object-cover" />
          <AvatarFallback className="text-md bg-primary/10 text-primary">
            {full_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <h3 className="text-base font-semibold text-foreground ltr:text-left rtl:text-right truncate">
            {full_name}
          </h3>

          <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1.5">
            {user.email && (
              <div className="flex items-center text-sm font-medium gap-1.5 text-card-foreground/60 ltr:flex-row rtl:flex-row-reverse">
                <Mail className="size-3.5 shrink-0" />
                <span dir="ltr" className="truncate">
                  {user.email}
                </span>
              </div>
            )}

            {user.phone && (
              <div className="flex items-center text-sm font-medium gap-1.5 text-card-foreground/60 ltr:flex-row rtl:flex-row-reverse">
                <Phone className="size-3.5 shrink-0" />
                <span dir="ltr" className="truncate">
                  {user.phone}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
