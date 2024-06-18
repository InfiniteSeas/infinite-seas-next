"use server";

import { SuiClient } from "@mysten/sui/client";
import axios from "axios";

import { INDEXER_BASE_URL, SUI_TESTNET_JSON_RPC } from "@/constant";

const client = new SuiClient({ url: SUI_TESTNET_JSON_RPC });

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
        sequenceNumber: content.skill_process_id.fields.sequence_number,
        batchSize: content.batch_size,
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

export async function suiPlayerRosters({ playerId }: { playerId: string }) {
  const { data: rosters } = await axios.get(`${INDEXER_BASE_URL}/Rosters?rosterId.playerId=${playerId}`);

  const suiRosters = await Promise.all(
    rosters.map(async (roster: { id_: any }) => {
      const suiData = await client.getObject({ id: roster.id_, options: { showContent: true } });
      // @ts-ignore
      const content = suiData.data?.content.fields;

      // const suiRoster = {
      //   id_: roster.id_,
      // };

      return content;
    })
  );

  return suiRosters;
}

export async function getPlayerRosters({ playerId }: { playerId: string }) {
  const { data } = await axios.get(`${INDEXER_BASE_URL}/Rosters?rosterId.playerId=${playerId}`);
  return data;
}
