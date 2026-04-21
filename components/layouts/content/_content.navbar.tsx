import logo from "@/assets/fallback-logo.svg";
import { SwitchLanguage } from "@/components/ui/language/switch-language";
import { RouterLink } from "@/components/ui/link";
import { ThemeToggle } from "@/components/ui/theme";
import { UserNavgation } from "@/components/ui/user-navigation";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export const ContentNavabr = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const navigation = [
    {
      label: t("navigation.shipments.orders"),
      to: paths.client.shipments.orders.route(),
    },
    {
      label: t("navigation.shipments.old"),
      to: paths.client.shipments.old.route(),
    },
  ];

  return (
    <header className="h-14 border-b border-border w-full flex items-center bg-card/15  z-50 backdrop-blur-xl sticky inset-0 ">
      <nav className="flex items-center justify-between w-5xl mx-auto">
        <div role="logo-container" className="flex items-center gap-2">
          <Image className="size-8" src={logo} alt="App Logo" />
          <h3 className="text-primary text-xl font-bold uppercase treaking-relaxed">
            {t("app.name")}
          </h3>
        </div>
        <ul className="flex text-sm items-center gap-2">
          {navigation.map((item, index) => (
            <li key={index}>
              <RouterLink
                to={item.to}
                className={cn(
                  "text-sm font-semibold px-4 py-1.5 rounded-sm",
                  pathname === item.to &&
                    "bg-primary text-primary-foreground font-bold",
                )}
              >
                {item.label}
              </RouterLink>
            </li>
          ))}
          <li className="flex items-center gap-2">
            <SwitchLanguage/>
            <ThemeToggle/>
            <UserNavgation />
          </li>
        </ul>
      </nav>
    </header>
  );
};
