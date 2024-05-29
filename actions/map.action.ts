"use server";

import axios from "axios";
import { SuiClient } from "@mysten/sui.js/client";

import { INDEXER_BASE_URL, MAP, SUI_TESTNET_JSON_RPC } from "@/constant";

const client = new SuiClient({ url: SUI_TESTNET_JSON_RPC });

export async function suiAllIslandsInfo() {
  const map = await client.getObject({
    id: MAP,
    options: { showContent: true },
  });

  // @ts-ignore
  const locationDynamicFieldId = map.data?.content.fields.locations.fields.id.id;

  const { data: locationObjects } = await client.getDynamicFields({
    parentId: locationDynamicFieldId,
  });

  const islandInfos: any[] = [];

  for (let i = 0; i < locationObjects.length; i++) {
    const locationInfo = await client.getObject({
      id: locationObjects[i].objectId,
      options: { showContent: true },
    });

    // @ts-ignore
    islandInfos.push(locationInfo.data?.content.fields.value.fields);
  }

  return islandInfos;
}

export async function getAllIslandsInfo() {
  const { data } = await axios.get(`${INDEXER_BASE_URL}/Maps/${MAP}`);
  return data.locations;
}
