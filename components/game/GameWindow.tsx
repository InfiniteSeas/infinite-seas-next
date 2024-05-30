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

export default function GameWindow({
  islandsInfo,
}: {
  islandsInfo: {
    occupiedBy: string;
    coordinates: { x: any; y: any };
    resources: any[];
  }[];
}) {
  const [currentPlayer, setCurrentPlayer] = useState<any>();

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
  const [actionQueueFlag, setActionQueueFlag] = useState<boolean>(false);
  const [rankListFlag, setRankListFlag] = useState<boolean>(false);
  const [islandFreeFlag, setIslandFreeFlag] = useState<boolean>(false);

  const [productType, setProductType] = useState<string>("ore");
  const [skillProcesses, setSkillProcesses] = useState<any[]>([]);
  const [unassignedRosterId, setUnassignedRosterId] = useState<string>("");

  const currentAccount = useCurrentAccount();

  useEffect(() => {
    async function getCurrentPlayer() {
      if (!currentAccount) return;

      const playerId = await getPlayerId({ owner: currentAccount.address });
      const player = await suiPlayerInfo({ playerId });

      setCurrentPlayer(player);
    }

    getCurrentPlayer();
  }, [currentAccount]);

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

  async function handleIslandCardClicked() {
    if (!currentPlayer) return toast.error("Please login first!");

    setIslandMenuFlag((prev) => !prev);
    setIslandTopbarFlag(false);
    setShipsMenuFlag(false);

    if (!currentPlayer.claimed_island) return toast.error("Please select an island and claim it first!");

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

    // console.log(currentPlayer.claimed_island.type);

    // Get player's skill processes
    const processes = await getPlayerSkillProcesses({ playerId: currentPlayer.id.id });
    setSkillProcesses(processes);

    // Get player's rosters
    const rosters = await getPlayerRosters({ playerId: currentPlayer.id.id });
    setUnassignedRosterId(rosters[0].id_);
  }

  function handleShipsClicked() {
    setShipsMenuFlag((prev) => !prev);
    setIslandMenuFlag(false);
    setIslandTopbarFlag(false);
  }

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
      <NavItems getIslandClicked={handleIslandCardClicked} getShipsClicked={handleShipsClicked} />

      {/* Single topbar for checking other island */}
      {islandTopbarFlag && (
        <div className="fixed top-0 left-0 w-3/5 flex flex-col justify-between ml-[18%] mr-[20%] pt-4">
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
        </div>
      )}

      {/* Island Menu */}
      {islandMenuFlag && (
        <div className="fixed top-0 left-0 w-3/5 h-screen flex flex-col justify-between ml-[18%] mr-[20%] py-4">
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

          <div className="flex-1 relative my-4">
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

          <ActionButtons handleActionClick={handleActionClick} />
        </div>
      )}

      {actionQueueFlag && <ActionQueue skillProcesses={skillProcesses} unassignedRosterId={unassignedRosterId} />}

      {rankListFlag && <RankList />}

      {shipsMenuFlag && <ShipsMenu closeShipsMenu={() => setShipsMenuFlag(false)} />}

      <GameCanvas islandsInfo={islandsInfo} islandClickedFlag={islandMenuFlag} getIslandClicked={handleIslandClicked} />
    </>
  );
}
