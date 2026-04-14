"use client";
import arFlag from "@/assets/flags/ar.svg";
import enFlag from "@/assets/flags/us.svg";
import frFlag from "@/assets/flags/fr.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdown-menu";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Button } from "../button";
type Language = {
  code: string;
  label: string;
  flag: any;
};

const languages: Language[] = [
  { code: "fr", label: "Français", flag: frFlag },
  { code: "ar", label: "العربية", flag: arFlag },
  { code: "en", label: "English", flag: enFlag },
];

export function SwitchLanguage() {
  const [selected, setSelected] = useState<Language>(languages[0]);
  const { i18n } = useTranslation(); // Add this hook

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "fr";
    const langObj = languages.find((l) => l.code === savedLang) || languages[0];
    setSelected(langObj);

    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }

    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLang;
  }, [i18n]); // Add i18n to dependencies

  const handleChange = (lang: Language) => {
    if (i18n.language === lang.code) return;
    setSelected(lang);
    i18n.changeLanguage(lang.code);
    localStorage.setItem("lang", lang.code);
    document.documentElement.dir = lang.code === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang.code;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="plain"
          className="size-9 rounded-full bg-card cursor-pointer overflow-hidden flex items-center justify-center"
        >
          <Avatar className="size-9 flex items-center justify-center">
            <AvatarImage src={selected.flag.src} className="size-5" />
            <AvatarFallback>
              <Globe className="size-5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border rounded-xs">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang)}
            className={`flex items-center gap-2 cursor-pointer ${
              lang.code === selected.code ? "font-semibold" : ""
            }`}
          >
            <img src={lang.flag.src} alt={lang.label} className="h-4 w-4" />
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
