import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kabadiwala Connect | Admin Portal",
  description:
    "Administration and recycler verification portal",
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