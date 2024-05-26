"use server";

import axios from "axios";

import { INDEXER_BASE_URL } from "@/constant";

export async function getUserInfo({ owner }: { owner: string }) {
  const { data } = await axios.get(`${INDEXER_BASE_URL}/Players?owner=${owner}`);
  return data;
}
