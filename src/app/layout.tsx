import type { Metadata } from "next";
import { Montserrat, Space_Mono } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

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
        width: 256,
        height: 256,
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
    <html lang="en" className={`${montserrat.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
