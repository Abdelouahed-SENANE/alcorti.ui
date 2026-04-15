"use client";
import fallbackAvatar from "@/assets/avatar-fallback.png";
import { Button } from "@/components/ui/button";
import i18n from "@/config/i18n";
import { paths } from "@/config/paths";
import { useLogout, useUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Power, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown/index";
import { RouterLink } from "../link/index";
type UserNavItem = {
  title: string;
  items: any[];
};

export const UserNavgation = () => {
  const user = useUser();
  const qc = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const lang = i18n.language;
  const logout = useLogout({
    onSuccess: () => {
      qc.clear();
      router.replace(paths.auth.login.route(pathname));
    },
  });

  const navigation = [
    {
      items: [
        {
          name: t("navigation.profile"),
          to: paths.profile.route(),
          icon: User,
        },
      ],
    },
  ].filter(Boolean) as UserNavItem[];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"icon"}
          className=" shadow-none  text-primary-foreground hover:text-primary-foreground hover:bg-primary hover:outline-primary  duration-300 transition-colors bg-primary  cursor-pointer size-8  overflow-hidden rounded-full"
        >
          <span className="sr-only">Open user menu</span>
          <Avatar className="size-9">
            <AvatarImage src={fallbackAvatar.src} alt="Logo" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={6}
        align="end"
        className="min-w-60 bg-card rounded-none border p-0"
      >
        <DropdownMenuItem className="flex items-center bg-primary/5 px-6 py-3 focus:bg-transparent">
          <Avatar className="size-9">
            <AvatarImage src={fallbackAvatar.src} alt="Logo" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="">
            <h6 className="font-medium text-sm">
              {`${user?.data?.first_name} ${user?.data?.last_name}`}
            </h6>
            <small className="text- mb-0 text-sm">{user?.data?.email}</small>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {navigation.map((nav, index) => (
          <DropdownMenuItem
            key={index}
            className="rounded-none focus:bg-transparent flex flex-col p-0 "
          >
            {nav.items &&
              nav.items.map((item, index) => (
                <RouterLink
                  key={index}
                  to={item.to}
                  className="flex w-full text-card-foreground  px-6 py-4 hover:bg-border/50   hover:text-card-foreground/95 text-sm font-medium gap-2 cursor-pointer duration-300 ease-in-out items-center"
                >
                  <item.icon
                    className={cn("size-4 shrink-0 text-card-foreground")}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </RouterLink>
              ))}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="border-b border-b-border" />
        <DropdownMenuItem className="rounded-none p-0 flex items-start">
          <Button
            onClick={() => {
              logout.mutate({});
            }}
            variant={"plain"}
            className="p-0 rounded-none px-6 py-2  h-full cursor-pointer text-error space-x-2  w-full text-left  items-start  transition-colors"
          >
            <Power className="text-error" />
            <span>{t("navigation.logout")}</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
