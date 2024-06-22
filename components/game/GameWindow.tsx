"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import NavItems from "@/components/shared/NavItems";
import IslandTopbar from "@/components/shared/IslandTopbar";
import ActionButtons from "@/components/shared/ActionButtons";
import RankList from "@/components/shared/RankList";
import ActionQueue from "@/components/shared/ActionQueue";
import IslandProductMenu from "@/components/menus/IslandProductMenu";
import ShipsMenu from "@/components/menus/ShipsMenu";
import BagMenu from "@/components/menus/BagMenu";
import CraftMenu from "@/components/menus/CraftMenu";
import GameCanvas from "@/components/game/GameCanvas";
import ClaimIslandForm from "@/components/form/ClaimIslandForm";

import { suiPlayerInfo } from "@/actions/player.action";
import { useGlobalContext } from "@/context/GlobalContext";

export default function GameWindow({
  islandsInfo,
}: {
  islandsInfo: {
    occupiedBy: string;
    coordinates: { x: number; y: number };
    resources: any[];
  }[];
}) {
  const [islandOwnerName, setIslandOwnerName] = useState<string>("");
  const [islandOwnerExp, setIslandOwnerExp] = useState<number>(0);
  const [islandOwnerLevel, setIslandOwnerLevel] = useState<number>(0);
  const [islandCoordinateX, setIslandCoordinateX] = useState<number>(0);
  const [islandCoordinateY, setIslandCoordinateY] = useState<number>(0);

  const [oreLeft, setOreLeft] = useState<number>(0);
  const [woodLeft, setWoodLeft] = useState<number>(0);
  const [seedsLeft, setSeedsLeft] = useState<number>(0);
  const [copperLeft, setCopperLeft] = useState<number>(0);
  const [logLeft, setLogLeft] = useState<number>(0);
  const [cottonLeft, setCottonLeft] = useState<number>(0);

  const [islandMenuFlag, setIslandMenuFlag] = useState<boolean>(false);
  const [shipsMenuFlag, setShipsMenuFlag] = useState<boolean>(false);
  const [islandProductMenuFlag, setIslandProductMenuFlag] = useState<boolean>(false);
  const [bagMenuFlag, setBagMenuFlag] = useState<boolean>(false);
  const [craftMenuFlag, setCraftMenuFlag] = useState<boolean>(false);
  const [islandTopbarFlag, setIslandTopbarFlag] = useState<boolean>(false);
  const [actionQueueFlag, setActionQueueFlag] = useState<boolean>(true);
  const [rankListFlag, setRankListFlag] = useState<boolean>(true);
  const [islandFreeFlag, setIslandFreeFlag] = useState<boolean>(false);

  const [productType, setProductType] = useState<string>("ore");

  const { currentPlayerId, currentPlayerInfo, skillProcesses } = useGlobalContext();

  // Rerender menus related to the current player's info
  useEffect(() => {
    setCurrentPlayerResources();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillProcesses]);

  // Menu toggle
  useEffect(() => {
    if (!islandMenuFlag && !shipsMenuFlag) {
      setActionQueueFlag(true);
      setRankListFlag(true);
    } else {
      setActionQueueFlag(false);
      setRankListFlag(false);
    }
  }, [islandMenuFlag, shipsMenuFlag]);

  // Click island on the game canvas only display the topbar
  async function handleIslandClicked(x: number, y: number) {
    setIslandTopbarFlag(true);
    setIslandMenuFlag(false);

    const islands = islandsInfo.filter((info) => info.coordinates.x === x && info.coordinates.y === y);

    setIslandCoordinateX(islands[0].coordinates.x);
    setIslandCoordinateY(islands[0].coordinates.y);

    const player = await suiPlayerInfo({ playerId: islands[0].occupiedBy });

    // Get island resources
    if (islands[0].resources.length > 0)
      islands[0].resources.forEach((inv) => {
        if (inv.fields.item_id === 2000000003) setOreLeft(inv.fields.quantity);
        else if (inv.fields.item_id === 2000000001) setWoodLeft(inv.fields.quantity);
        else if (inv.fields.item_id === 2) setSeedsLeft(inv.fields.quantity);
      });
    else if (islands[0].occupiedBy) {
      player.inventory.forEach((inv: any) => {
        if (inv.fields.item_id === 2000000003) setOreLeft(inv.fields.quantity);
        else if (inv.fields.item_id === 2000000001) setWoodLeft(inv.fields.quantity);
        else if (inv.fields.item_id === 2) setSeedsLeft(inv.fields.quantity);
      });

      setIslandOwnerName(player.name);
      setIslandOwnerExp(player.experience);
      setIslandOwnerLevel(player.level);
      
      setIslandFreeFlag(false);
    }

    if (!islands[0].occupiedBy) {
      setIslandOwnerName("");
      setIslandOwnerExp(0);
      setIslandOwnerLevel(0);

      if (!currentPlayerInfo) setIslandFreeFlag(false);
      else if (!currentPlayerInfo.claimed_island) setIslandFreeFlag(true);
    }
  }

  // Click island card can display not only topbar but also other menus of the current player
  function handleIslandCardClicked() {
    if (!currentPlayerId) return toast.error("Please login first or wait for the login process to end!");
    if (!currentPlayerInfo.claimed_island) return toast.error("Please select an island and claim it first!");

    setIslandMenuFlag((prev) => !prev);
    setIslandTopbarFlag(false);
    setShipsMenuFlag(false);

    setIslandOwnerName(currentPlayerInfo.name);
    setIslandOwnerExp(currentPlayerInfo.experience);
    setIslandOwnerLevel(currentPlayerInfo.level);

    setCurrentPlayerResources();
  }

  function setCurrentPlayerResources() {
    if (!currentPlayerInfo) return;

    currentPlayerInfo.inventory.forEach((inv: any) => {
      if (inv.fields.item_id === 2000000003) setOreLeft(inv.fields.quantity);
      else if (inv.fields.item_id === 2000000001) setWoodLeft(inv.fields.quantity);
      else if (inv.fields.item_id === 2) setSeedsLeft(inv.fields.quantity);
      else if (inv.fields.item_id === 301) setCopperLeft(inv.fields.quantity);
      else if (inv.fields.item_id === 200) setLogLeft(inv.fields.quantity);
      else if (inv.fields.item_id === 102) setCottonLeft(inv.fields.quantity);
    });
  }

  // Click ships card
  function handleShipsClicked() {
    setShipsMenuFlag((prev) => !prev);
    setIslandMenuFlag(false);
    setIslandTopbarFlag(false);
  }

  // Click action buttons
  function handleActionClick(flag: string) {
    // Product buttons
    if (["ore", "wood", "seed"].includes(flag)) {
      setProductType(flag);

      if (flag === productType) setIslandProductMenuFlag((prev) => !prev);
      else setIslandProductMenuFlag(true);

      setBagMenuFlag(false);
      setCraftMenuFlag(false);
    }

    // Inventory button
    else if (flag === "bag") {
      setBagMenuFlag((prev) => !prev);
      setIslandProductMenuFlag(false);
      setCraftMenuFlag(false);
    }

    // Craft button
    else if (flag === "craft") {
      setCraftMenuFlag((prev) => !prev);
      setIslandProductMenuFlag(false);
      setBagMenuFlag(false);
    }
  }

  return (
    <>
      <NavItems getIslandClicked={handleIslandCardClicked} getShipsClicked={handleShipsClicked} />

      {islandFreeFlag && (
        <ClaimIslandForm
          coordinateX={islandCoordinateX}
          coordinateY={islandCoordinateY}
          handleCloseModal={() => setIslandFreeFlag(false)}
        />
      )}

      {/* Single topbar for checking other island */}
      {(islandMenuFlag || islandTopbarFlag) && (
        <IslandTopbar
          islandOwnerName={islandOwnerName}
          islandOwnerExp={islandOwnerExp}
          islandOwnerLevel={islandOwnerLevel}
          oreLeft={oreLeft}
          woodLeft={woodLeft}
          seedsLeft={seedsLeft}
        />
      )}

      {/* Island Menu */}
      {islandMenuFlag && (
        <>
          {islandProductMenuFlag && (
            <IslandProductMenu productType={productType} oreLeft={oreLeft} woodLeft={woodLeft} seedsLeft={seedsLeft} />
          )}

          {bagMenuFlag && <BagMenu copperLeft={copperLeft} logLeft={logLeft} cottonLeft={cottonLeft} />}

          {craftMenuFlag && <CraftMenu copperLeft={copperLeft} logLeft={logLeft} cottonLeft={cottonLeft} />}

          <ActionButtons handleActionClick={handleActionClick} />
        </>
      )}

      {actionQueueFlag && <ActionQueue />}

      {rankListFlag && <RankList />}

      {shipsMenuFlag && <ShipsMenu closeShipsMenu={() => setShipsMenuFlag(false)} />}

      <GameCanvas
        islandsInfo={islandsInfo}
        islandClickedFlag={islandMenuFlag}
        currentPlayerIsland={
          currentPlayerInfo && currentPlayerInfo.claimed_island
            ? currentPlayerInfo.claimed_island.fields
            : { x: 0, y: 0 }
        }
        getIslandClicked={handleIslandClicked}
      />
    </>
  );
}
