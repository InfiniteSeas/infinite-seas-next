import SuiKit from "@/components/wallet/SuiKit";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Infinite Seas Demo Next",
  description: "This is the Infinite Seas Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SuiKit>{children}</SuiKit>
      </body>
    </html>
  );
}
