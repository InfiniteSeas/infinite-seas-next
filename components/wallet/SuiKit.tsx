"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";

import { SUI_TESTNET_JSON_RPC } from "@/constant";

const queryClient = new QueryClient();

// Config options for the networks you want to connect to
// @ts-ignore
const { networkConfig } = createNetworkConfig({
  suiTestnet: { url: SUI_TESTNET_JSON_RPC },
});

export default function SuiKit({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig}>
        <WalletProvider>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
