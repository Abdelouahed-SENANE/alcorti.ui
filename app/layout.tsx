import favicon from "@/public/favicon.svg";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Roboto } from "next/font/google";
import { Providers } from "./providers";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      lang="en"
      suppressHydrationWarning
      className={`${roboto.variable} ${ibmPlexSansArabic.variable} font-display h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
