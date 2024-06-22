"use client";

import { EnokiFlowProvider } from "@mysten/enoki/react";
import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ENOKI_PUBLIC_API_KEY, SUI_TESTNET_JSON_RPC } from "@/constant";

const queryClient = new QueryClient();

// Config options for the networks you want to connect to
// @ts-ignore
const { networkConfig } = createNetworkConfig({
  suiTestnet: { url: SUI_TESTNET_JSON_RPC },
});

export default function SuiKit({ children }: { children: React.ReactNode }) {
  return (
    <EnokiFlowProvider apiKey={ENOKI_PUBLIC_API_KEY}>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig}>
          <WalletProvider>{children}</WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </EnokiFlowProvider>
  );
}
