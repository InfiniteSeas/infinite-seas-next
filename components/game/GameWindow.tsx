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

export default function GameWindow() {
  const [islandMenuFlag, setIslandMenuFlag] = useState<boolean>(false);
  const [shipsMenuFlag, setShipsMenuFlag] = useState<boolean>(false);
  const [islandProductMenuFlag, setIslandProductMenuFlag] = useState<boolean>(false);
  const [bagMenuFlag, setBagMenuFlag] = useState<boolean>(false);
  const [craftMenuFlag, setCraftMenuFlag] = useState<boolean>(false);
  const [productType, setProductType] = useState<string>("iron");

  function handleIslandClicked() {
    setIslandMenuFlag((prev) => !prev);
    setShipsMenuFlag(false);
  }

  function handleShipsClicked() {
    setShipsMenuFlag((prev) => !prev);
    setIslandMenuFlag(false);
  }

  function handleButtonClick(flag: string) {
    if (flag === productType) {
      setProductType(flag);
      setIslandProductMenuFlag(false);
    } else setIslandProductMenuFlag(true);

    if (flag === "bag") setBagMenuFlag(true);
    else setBagMenuFlag(false);

    if (flag === "craft") setCraftMenuFlag(true);
    else setCraftMenuFlag(false);
  }

  return (
    <main>
      <NavItems getIslandClicked={handleIslandClicked} getShipsClicked={handleShipsClicked} />

      {/* Island Menu */}
      {islandMenuFlag && (
        <div className="fixed top-0 left-0 w-2/3 h-screen flex flex-col justify-between ml-[15%] mr-[20%]">
          <IslandTopbar />

          <div className="flex-1 relative">
            {islandProductMenuFlag && <IslandProductMenu productType={productType} />}
            {bagMenuFlag && <BagMenu maxSpace={20} />}
            {craftMenuFlag && <CraftMenu />}
          </div>

          <ActionQueue />

          <IslandButtons handleButtonClick={handleButtonClick} />

          <RankList />
        </div>
      )}

      {shipsMenuFlag && <ShipsMenu closeShipsMenu={() => setShipsMenuFlag(false)} />}

      <GameCanvas islandClickedFlag={islandMenuFlag} getIslandClicked={handleIslandClicked} />
    </main>
  );
}
