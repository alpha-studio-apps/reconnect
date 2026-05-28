import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Reconnect — A 14-Day Practice",
  description:
    "A quiet 14-day practice for reconnecting with what matters most. Not a tracker. Not a program. Just honest questions and honest answers.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Reconnect",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    title: "Reconnect",
    description: "A 14-day emotional reset and reconnection practice.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full`}
    >
      <body className="flex flex-col min-h-full">
        <LocaleProvider>
          <ServiceWorkerRegistrar />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
