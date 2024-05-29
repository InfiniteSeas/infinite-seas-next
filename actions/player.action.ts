"use server";

import { SuiClient } from "@mysten/sui.js/client";
import axios from "axios";

import { INDEXER_BASE_URL, SUI_TESTNET_JSON_RPC } from "@/constant";

const client = new SuiClient({ url: SUI_TESTNET_JSON_RPC });

export async function suiPlayerInfo({ playerId }: { playerId: string }) {
  const player = await client.getObject({
    id: playerId,
    options: { showContent: true },
  });

  // @ts-ignore
  return player.data?.content.fields;
}

export async function getPlayerId({ owner }: { owner: string }) {
  const { data } = await axios.get(`${INDEXER_BASE_URL}/Players?owner=${owner}`);

  if (data.length === 0) return;
  return data[0].id;
}

export async function getPlayerSkillProcesses({ playerId }: { playerId: string }) {
  const { data } = await axios.get(`${INDEXER_BASE_URL}/SkillProcesses?skillProcessId.playerId=${playerId}`);
  return data;
}

export async function getPlayerRosters({ playerId }: { playerId: string }) {
  const { data } = await axios.get(`${INDEXER_BASE_URL}/Rosters?rosterId.playerId=${playerId}`);
  return data;
}
