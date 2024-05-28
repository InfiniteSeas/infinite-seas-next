"use server";

import { SuiClient } from "@mysten/sui.js/client";

import { COIN_PACKAGE_ID, INDEXER_BASE_URL, MAP_ID, SUI_TESTNET_JSON_RPC } from "@/constant";

// create a client connected to devnet
const client = new SuiClient({ url: SUI_TESTNET_JSON_RPC });

export async function suixEnergyCoins({ owner }: { owner: string }) {
  const energyCoins = await client.getCoins({
    owner,
    coinType: `${COIN_PACKAGE_ID}::energy::ENERGY`,
  });

  return energyCoins.data;
}
