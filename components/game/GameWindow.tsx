"use client";

import { useState } from "react";

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

export default function GameWindow({
  islandOwnerName,
  islandOwnerExp,
  islandOwnerLevel,
  oreLeft,
  woodLeft,
  seedsLeft,
  skillProcesses,
  copperLeft,
  logLeft,
  cottonLeft,
}: {
  islandOwnerName: string;
  islandOwnerExp: number;
  islandOwnerLevel: number;
  oreLeft: number;
  woodLeft: number;
  seedsLeft: number;
  skillProcesses: any[];
  copperLeft: number;
  logLeft: number;
  cottonLeft: number;
}) {
  const [islandMenuFlag, setIslandMenuFlag] = useState<boolean>(false);
  const [shipsMenuFlag, setShipsMenuFlag] = useState<boolean>(false);
  const [islandProductMenuFlag, setIslandProductMenuFlag] = useState<boolean>(false);
  const [bagMenuFlag, setBagMenuFlag] = useState<boolean>(false);
  const [craftMenuFlag, setCraftMenuFlag] = useState<boolean>(false);

  const [productType, setProductType] = useState<string>("ore");

  async function handleIslandClicked() {
    setIslandMenuFlag((prev) => !prev);
    setShipsMenuFlag(false);
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
          <IslandTopbar
            islandOwnerExp={islandOwnerExp}
            islandOwnerName={islandOwnerName}
            islandOwnerLevel={islandOwnerLevel}
            oreLeft={oreLeft}
            woodLeft={woodLeft}
            seedsLeft={seedsLeft}
          />

          <div className="flex-1 relative my-12">
            {islandProductMenuFlag && (
              <IslandProductMenu
                productType={productType}
                skillProcesses={skillProcesses}
                oreLeft={oreLeft}
                woodLeft={woodLeft}
                seedsLeft={seedsLeft}
              />
            )}
            {bagMenuFlag && <BagMenu maxSpace={20} />}
            {craftMenuFlag && (
              <CraftMenu
                copperLeft={copperLeft}
                logLeft={logLeft}
                cottonLeft={cottonLeft}
                skillProcesses={skillProcesses}
              />
            )}
          </div>

          <IslandButtons handleButtonClick={handleIslandButtonClick} />

          <ActionQueue skillProcesses={skillProcesses} />

          <RankList />
        </div>
      )}

      {shipsMenuFlag && <ShipsMenu closeShipsMenu={() => setShipsMenuFlag(false)} />}

      <GameCanvas islandClickedFlag={islandMenuFlag} getIslandClicked={handleIslandClicked} />
    </>
  );
}
