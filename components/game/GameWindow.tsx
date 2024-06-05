"use client";

import { useEffect, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
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

import { getPlayerId, getPlayerRosters, getPlayerSkillProcesses, suiPlayerInfo } from "@/actions/player.action";
import { suixEnergyCoins } from "@/actions/coin.action";

import { formatSui } from "@/utils/tools";

export default function GameWindow({
  islandsInfo,
}: {
  islandsInfo: {
    occupiedBy: string;
    coordinates: { x: number; y: number };
    resources: any[];
  }[];
}) {
  const [currentPlayer, setCurrentPlayer] = useState<any>();
  const [energyObjectId, setEnergyObjectId] = useState<string>("");
  const [energyBalance, setEnergyBalance] = useState<number>(0);

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
  const [skillProcesses, setSkillProcesses] = useState<any[]>([]);
  const [unassignedRosterId, setUnassignedRosterId] = useState<string>("");

  const currentAccount = useCurrentAccount();

  useEffect(() => {
    async function initCurrentPlayer() {
      if (!currentAccount) return;

      const playerId = await getPlayerId({ owner: currentAccount.address });
      const player = await suiPlayerInfo({ playerId });
      setCurrentPlayer(player);

      const energyCoins = await suixEnergyCoins({ owner: currentAccount.address });
      if (energyCoins.length === 0) return;

      setEnergyBalance(formatSui(energyCoins[0].balance));
      setEnergyObjectId(energyCoins[0].coinObjectId);

      // Get player's skill processes for action queue
      const processes = await getPlayerSkillProcesses({ playerId: player.id.id });
      setSkillProcesses(processes);
    }

    initCurrentPlayer();
  }, [currentAccount]);

  useEffect(() => {
    if (!islandMenuFlag && !shipsMenuFlag) {
      setActionQueueFlag(true);
      setRankListFlag(true);
    } else {
      setActionQueueFlag(false);
      setRankListFlag(false);
    }
  }, [islandMenuFlag, shipsMenuFlag]);

  // Click island on the game canvas
  async function handleIslandClicked(x: number, y: number) {
    setIslandTopbarFlag(true);
    setIslandMenuFlag(false);

    const islands = islandsInfo.filter((info) => info.coordinates.x === x && info.coordinates.y === y);

    setIslandCoordinateX(islands[0].coordinates.x);
    setIslandCoordinateY(islands[0].coordinates.y);

    islands[0].resources.forEach((inv) => {
      if (inv.fields.item_id === 2000000003) setOreLeft(inv.fields.quantity);
      else if (inv.fields.item_id === 2000000001) setWoodLeft(inv.fields.quantity);
      else if (inv.fields.item_id === 2) setSeedsLeft(inv.fields.quantity);
    });

    if (islands[0].occupiedBy) {
      const player = await suiPlayerInfo({ playerId: islands[0].occupiedBy });
      setIslandOwnerName(player.name);
      setIslandOwnerExp(player.experience);
      setIslandOwnerLevel(player.level);
      setIslandFreeFlag(false);
    } else {
      setIslandOwnerName("");
      setIslandOwnerExp(0);
      setIslandOwnerLevel(0);

      if (!currentPlayer) setIslandFreeFlag(false);
      else if (!currentPlayer.claimed_island) setIslandFreeFlag(true);
    }
  }

  // Click island card
  async function handleIslandCardClicked() {
    if (!currentPlayer) return toast.error("Please login first!");
    if (!currentPlayer.claimed_island) return toast.error("Please select an island and claim it first!");

    setIslandMenuFlag((prev) => !prev);
    setIslandTopbarFlag(false);
    setShipsMenuFlag(false);

    setIslandOwnerName(currentPlayer.name);
    setIslandOwnerExp(currentPlayer.experience);
    setIslandOwnerLevel(currentPlayer.level);

    currentPlayer.inventory.forEach((inv: any) => {
      if (inv.fields.item_id === 2000000003) setOreLeft(inv.fields.quantity);
      else if (inv.fields.item_id === 2000000001) setWoodLeft(inv.fields.quantity);
      else if (inv.fields.item_id === 2) setSeedsLeft(inv.fields.quantity);
      else if (inv.fields.item_id === 301) setCopperLeft(inv.fields.quantity);
      else if (inv.fields.item_id === 200) setLogLeft(inv.fields.quantity);
      else if (inv.fields.item_id === 102) setCottonLeft(inv.fields.quantity);
    });

    // Get player's skill processes
    const processes = await getPlayerSkillProcesses({ playerId: currentPlayer.id.id });
    setSkillProcesses(processes);

    // Get player's rosters
    const rosters = await getPlayerRosters({ playerId: currentPlayer.id.id });
    setUnassignedRosterId(rosters[0].id_);
  }

  // Click ships card
  function handleShipsClicked() {
    setShipsMenuFlag((prev) => !prev);
    setIslandMenuFlag(false);
    setIslandTopbarFlag(false);
  }

  // Click action buttons
  function handleActionClick(flag: string) {
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
      <NavItems
        energyBalance={energyBalance}
        getIslandClicked={handleIslandCardClicked}
        getShipsClicked={handleShipsClicked}
      />

      {/* Single topbar for checking other island */}
      {(islandMenuFlag || islandTopbarFlag) && (
        <IslandTopbar
          islandOwnerName={islandOwnerName}
          islandOwnerExp={islandOwnerExp}
          islandOwnerLevel={islandOwnerLevel}
          islandCoordinateX={islandCoordinateX}
          islandCoordinateY={islandCoordinateY}
          islandFreeFlag={islandFreeFlag}
          oreLeft={oreLeft}
          woodLeft={woodLeft}
          seedsLeft={seedsLeft}
        />
      )}

      {/* Island Menu */}
      {islandMenuFlag && (
        <>
          {islandProductMenuFlag && (
            <IslandProductMenu
              productType={productType}
              skillProcesses={skillProcesses}
              oreLeft={oreLeft}
              woodLeft={woodLeft}
              seedsLeft={seedsLeft}
            />
          )}

          {bagMenuFlag && (
            <BagMenu
              oreLeft={oreLeft}
              woodLeft={woodLeft}
              seedsLeft={seedsLeft}
              copperLeft={copperLeft}
              logLeft={logLeft}
              cottonLeft={cottonLeft}
            />
          )}

          {craftMenuFlag && (
            <CraftMenu
              copperLeft={copperLeft}
              logLeft={logLeft}
              cottonLeft={cottonLeft}
              skillProcesses={skillProcesses}
            />
          )}

          <ActionButtons handleActionClick={handleActionClick} />
        </>
      )}

      {actionQueueFlag && <ActionQueue skillProcesses={skillProcesses} unassignedRosterId={unassignedRosterId} />}

      {rankListFlag && <RankList />}

      {shipsMenuFlag && <ShipsMenu closeShipsMenu={() => setShipsMenuFlag(false)} />}

      <GameCanvas
        islandsInfo={islandsInfo}
        islandClickedFlag={islandMenuFlag}
        currentPlayerIsland={
          currentPlayer && currentPlayer.claimed_island ? currentPlayer.claimed_island.fields : { x: 0, y: 0 }
        }
        getIslandClicked={handleIslandClicked}
      />
    </>
  );
}
