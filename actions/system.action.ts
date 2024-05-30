"use server";

import { revalidatePath } from "next/cache";
import { SuiClient } from "@mysten/sui.js/client";

import { SUI_TESTNET_JSON_RPC } from "@/constant";

const client = new SuiClient({ url: SUI_TESTNET_JSON_RPC });

export async function waitForReceipt({ digest }: { digest: string }) {
  const receipt = await client.getTransactionBlock({ digest, options: { showEffects: true } });
  return receipt;
}

export async function revalidateGame() {
  revalidatePath("/");
}
