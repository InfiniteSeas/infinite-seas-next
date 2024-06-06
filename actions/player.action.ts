"use server";

import { cookies } from "next/headers";
import { SuiClient } from "@mysten/sui.js/client";
import axios from "axios";

import { formatSui } from "@/utils/tools";
import { COIN_PACKAGE_ID, INDEXER_BASE_URL, SUI_TESTNET_JSON_RPC } from "@/constant";

const client = new SuiClient({ url: SUI_TESTNET_JSON_RPC });

// export async function loginPlayerByOwner({ owner }: { owner: string }) {
//   const { data } = await axios.get(`${INDEXER_BASE_URL}/Players?owner=${owner}`);
//   if (data.length === 0) return;

//   loginPlayer({ playerId: data[0].id, owner });
//   return data[0].id;
// }

// export async function loginPlayer({ playerId, owner }: { playerId: string; owner: string }) {
//   const energyCoins = await client.getCoins({ owner, coinType: `${COIN_PACKAGE_ID}::energy::ENERGY` });

//   const playerInfo = {
//     playerId,
//     energyObjectId: energyCoins.data[0].coinObjectId,
//     energyBalance: formatSui(energyCoins.data[0].balance),
//   };

//   cookies().set("infiniteseasPlayer", JSON.stringify(playerInfo), {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 60 * 60,
//     path: "/",
//   });
// }

// export async function getCurrentPlayer() {
//   const currentPlayer = cookies().get("infiniteseasPlayer")?.value;
//   if (currentPlayer) return JSON.parse(currentPlayer);
// }

export async function getCurrentPlayerId({ owner }: { owner: string }) {
  const { data } = await axios.get(`${INDEXER_BASE_URL}/Players?owner=${owner}`);

  if (data.length === 0) return;
  return data[0].id;
}

export async function suiPlayerInfo({ playerId }: { playerId: string }) {
  const player = await client.getObject({ id: playerId, options: { showContent: true } });

  // @ts-ignore
  return player.data?.content.fields;
}

export async function suiPlayerSkillProcesses({ playerId }: { playerId: string }) {
  const { data: processes } = await axios.get(`${INDEXER_BASE_URL}/SkillProcesses?skillProcessId.playerId=${playerId}`);

  const suiProcesses = await Promise.all(
    processes.map(async (process: { id_: any }) => {
      const suiData = await client.getObject({ id: process.id_, options: { showContent: true } });
      // @ts-ignore
      const content = suiData.data?.content.fields;

      const suiProcess = {
        id_: process.id_,
        skillType: content.skill_process_id.fields.skill_type,
        completed: content.completed,
        creationTime: content.creation_time,
        startedAt: content.started_at,
        endedAt: content.ended_at,
      };

      return suiProcess;
    })
  );

  return suiProcesses;
}

export async function getPlayerRosters({ playerId }: { playerId: string }) {
  const { data } = await axios.get(`${INDEXER_BASE_URL}/Rosters?rosterId.playerId=${playerId}`);
  return data;
}
