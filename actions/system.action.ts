"use server";

import { SuiClient } from "@mysten/sui/client";

import { SUI_TESTNET_JSON_RPC } from "@/constant";

const client = new SuiClient({ url: SUI_TESTNET_JSON_RPC });

export async function waitForReceipt({ digest }: { digest: string }) {
  const receipt = await client.waitForTransaction({ digest, options: { showEffects: true } });

  return {
    status: receipt.effects?.status.status,
    error: receipt.effects?.status.error,
  };
}
