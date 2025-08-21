import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/style/globals.css";

import Provider from "@/lib/providers/provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Order Management System - Placements.io",
  description:
    "A system which helps digital media publishers to management campaigns and associated invoices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
