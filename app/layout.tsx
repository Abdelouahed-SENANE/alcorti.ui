import { cn } from "@/lib/utils";
import favicon from "@/public/favicon.svg";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Providers } from "./providers";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Alcorti",
  description:
    "Alcorti is a comprehensive platform for managing your business.",
  icons: { icon: favicon.src },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      dir="ltr"
      suppressHydrationWarning
      className={cn(
        "font-display",
        "h-full",
        "antialiased",
        ibmPlexSansArabic.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
