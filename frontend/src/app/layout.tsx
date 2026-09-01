import { siteName, siteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata, Viewport } from "next";
import { Kumbh_Sans } from "next/font/google";
import "./globals.css";

const kumbhSans = Kumbh_Sans({
  variable: "--font-kumbh-sans",
  subsets: ["latin"],
  display: "swap",
});

const homeTitle = `${siteName} | Find your next developer role`;
const description =
  "Browse developer roles from companies hiring worldwide. Filter by title, location or full-time contract, then read the full brief and apply.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: homeTitle,
    shareTitle: homeTitle,
    description,
    path: "/",
  }),
  metadataBase: new URL(siteUrl),
  title: { default: homeTitle, template: `%s | ${siteName}` },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5964E0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${kumbhSans.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
