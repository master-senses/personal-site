import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hk39.dev"),
  title: "Hrishikesh Kalyanaraman",
  description:
    "Software engineer building AI tooling, design systems, and things that actually ship.",
  icons: {
    icon: "/hk-logo.svg",
    shortcut: "/hk-logo.svg",
    apple: "/hk-logo.svg",
  },
  openGraph: {
    title: "Hrishikesh Kalyanaraman",
    description:
      "Software engineer building AI tooling, design systems, and things that actually ship.",
    url: "https://hk39.dev",
    siteName: "Hrishikesh Kalyanaraman",
    images: [
      {
        url: "/hk-logo.png",
        width: 512,
        height: 512,
        alt: "HK logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Hrishikesh Kalyanaraman",
    description:
      "Software engineer building AI tooling, design systems, and things that actually ship.",
    images: ["/hk-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body style={{ margin: 0, overflow: "hidden" }}>{children}</body>
    </html>
  );
}
