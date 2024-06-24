import type { Metadata } from "next";
import "./globals.css";

import SuiKit from "@/context/SuiKit";
import AppToaster from "@/components/shared/AppToaster";

import GlobalContextProvider from "@/context/GlobalContext";

export const metadata: Metadata = {
  title: "Infinite Seas - Maritime Trading, Managing, and Battling Diplomatic Fully On-chain Game",
  description:
    "Infinite Seas is a maritime trading, managing, and battling diplomatic fully on-chain game. We believe the best fully onchain games should be fun and infinite (define by games that are non-session and infinitely large map) with an open economy design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>
          <SuiKit>
            <GlobalContextProvider>
              {children}
              <AppToaster />
            </GlobalContextProvider>
          </SuiKit>
        </main>
      </body>
    </html>
  );
}
