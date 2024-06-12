"use server";

import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { generateRandomness, getExtendedEphemeralPublicKey } from "@mysten/zklogin";
import axios from "axios";

import { SUI_TESTNET_JSON_RPC } from "@/constant";

const client = new SuiClient({ url: SUI_TESTNET_JSON_RPC });

export async function getSaltAndAddress({ jwt }: { jwt: string }) {
  try {
    const { data } = await axios.get("https://api.enoki.mystenlabs.com/v1/zklogin", {
      headers: { "zklogin-jwt": jwt },
    });

    return data;
  } catch (error: any) {
    return { data: error.message };
  }
}

export async function createZKP({ jwt }: { jwt: string }) {
  const ephemeralKeyPair = new Ed25519Keypair();
  const randomness = generateRandomness();

  const ephemeralPublicKey = getExtendedEphemeralPublicKey(ephemeralKeyPair.getPublicKey());

  try {
    const { data } = await axios.post(
      "https://api.enoki.mystenlabs.com/v1/zklogin/zkp",
      { network: "testnet", ephemeralPublicKey, maxEpoch: 0, randomness },
      {
        headers: { "zklogin-jwt": jwt },
      }
    );

    return data;
  } catch (error: any) {
    return { data: error.message };
  }
}

export async function waitForReceipt({ digest }: { digest: string }) {
  const receipt = await client.waitForTransaction({ digest, options: { showEffects: true } });

  return {
    status: receipt.effects?.status.status,
    error: receipt.effects?.status.error,
  };
}
