import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YTB Manual — 300-Hour Yoga Teacher Training",
  description: "Your complete guide to the 300-Hour Yoga Tribe Brooklyn Teacher Training program.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
