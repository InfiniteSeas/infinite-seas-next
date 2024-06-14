"use server";

import { SuiClient } from "@mysten/sui/client";

import { MAP, SUI_TESTNET_JSON_RPC } from "@/constant";

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
    const info = locationInfo.data?.content.fields.value.fields;

    const islandInfo = {
      occupiedBy: info.occupied_by,
      coordinates: { x: info.coordinates.fields.x, y: info.coordinates.fields.y },
      resources: info.resources,
    };

    islandInfos.push(islandInfo);
  }

  return islandInfos;
}
