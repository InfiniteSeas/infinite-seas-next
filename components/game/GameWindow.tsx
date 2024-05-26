"use client";

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

import NavItems from "@/components/shared/NavItems";
import IslandTopbar from "@/components/shared/IslandTopbar";
import IslandButtons from "@/components/shared/IslandButtons";
import RankList from "@/components/shared/RankList";
import ActionQueue from "@/components/shared/ActionQueue";

import IslandProductMenu from "@/components/menus/IslandProductMenu";
import ShipsMenu from "@/components/menus/ShipsMenu";
import BagMenu from "@/components/menus/BagMenu";
import CraftMenu from "@/components/menus/CraftMenu";

import GameCanvas from "@/components/game/GameCanvas";
import { getPlayerInfo, getPlayerSkillProcesses } from "@/actions/player.action";

export default function GameWindow() {
  const [islandMenuFlag, setIslandMenuFlag] = useState<boolean>(false);
  const [shipsMenuFlag, setShipsMenuFlag] = useState<boolean>(false);
  const [islandProductMenuFlag, setIslandProductMenuFlag] = useState<boolean>(false);
  const [bagMenuFlag, setBagMenuFlag] = useState<boolean>(false);
  const [craftMenuFlag, setCraftMenuFlag] = useState<boolean>(false);
  const [productType, setProductType] = useState<string>("ore");

  const [oreLeft, setOreLeft] = useState<number>(0);
  const [woodLeft, setWoodLeft] = useState<number>(0);
  const [seedsLeft, setSeedsLeft] = useState<number>(0);
  const [skillProcesses, setSkillProcesses] = useState<any[]>([]);

  async function handleIslandClicked() {
    setIslandMenuFlag((prev) => !prev);
    setShipsMenuFlag(false);

    if (islandMenuFlag) return;

    const player = await getPlayerInfo({
      owner: "0xf94d322ddf060d4dc9a9bee56d61ed119f39e17b5a1098d62254a10e37a86cf9", // TODO: change to island owner
    });
    player.inventory.forEach((inv: { itemId: number; quantity: number }) => {
      if (inv.itemId === 2000000003) setOreLeft(inv.quantity);
      if (inv.itemId === 2000000001) setWoodLeft(inv.quantity);
      if (inv.itemId === 2) setSeedsLeft(inv.quantity);
    });

    const processes = await getPlayerSkillProcesses({
      playerId: player.id,
    });
    setSkillProcesses(processes);
  }

  function handleShipsClicked() {
    setShipsMenuFlag((prev) => !prev);
    setIslandMenuFlag(false);
  }

  function handleIslandButtonClick(flag: string) {
    if (["ore", "wood", "seed"].includes(flag)) {
      setProductType(flag);

      if (flag === productType) setIslandProductMenuFlag((prev) => !prev);
      else setIslandProductMenuFlag(true);

      setBagMenuFlag(false);
      setCraftMenuFlag(false);
    }

    if (flag === "bag") {
      setBagMenuFlag((prev) => !prev);
      setIslandProductMenuFlag(false);
      setCraftMenuFlag(false);
    }

    if (flag === "craft") {
      setCraftMenuFlag((prev) => !prev);
      setIslandProductMenuFlag(false);
      setBagMenuFlag(false);
    }
  }

  return (
    <>
      <NavItems getIslandClicked={handleIslandClicked} getShipsClicked={handleShipsClicked} />

      {/* Island Menu */}
      {islandMenuFlag && (
        <div className="fixed top-0 left-0 w-3/5 h-screen flex flex-col justify-between ml-[18%] mr-[20%] pt-8">
          <IslandTopbar oreLeft={oreLeft} woodLeft={woodLeft} seedsLeft={seedsLeft} />

          <div className="flex-1 relative my-12">
            {islandProductMenuFlag && <IslandProductMenu productType={productType} skillProcesses={skillProcesses} />}
            {bagMenuFlag && <BagMenu maxSpace={20} />}
            {craftMenuFlag && <CraftMenu />}
          </div>

          <IslandButtons handleButtonClick={handleIslandButtonClick} />

          <ActionQueue />
          <RankList />
        </div>
      )}

      {shipsMenuFlag && <ShipsMenu closeShipsMenu={() => setShipsMenuFlag(false)} />}

      <GameCanvas islandClickedFlag={islandMenuFlag} getIslandClicked={handleIslandClicked} />
    </>
  );
}
