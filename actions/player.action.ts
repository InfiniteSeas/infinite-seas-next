"use server";

import axios from "axios";

import { INDEXER_BASE_URL } from "@/constant";

export async function getPlayerInfo({ owner }: { owner: string }) {
  const { data } = await axios.get(`${INDEXER_BASE_URL}/Players?owner=${owner}`);
  return data[0];
}

export async function getPlayerRosters({ playerId }: { playerId: string }) {
  const { data } = await axios.get(`${INDEXER_BASE_URL}/Rosters?rosterId.playerId=${playerId}`);
  return data;
}

export async function getPlayerSkillProcesses({ playerId }: { playerId: string }) {
  const { data } = await axios.get(`${INDEXER_BASE_URL}/SkillProcesses?skillProcessId.playerId=${playerId}`);
  return data;
}
