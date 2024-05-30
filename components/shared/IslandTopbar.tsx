"use client";

import Image from "next/image";

import ClaimIslandForm from "@/components/form/ClaimIslandForm";

export default function IslandTopbar({
  islandOwnerName,
  islandOwnerExp,
  islandOwnerLevel,
  islandCoordinateX,
  islandCoordinateY,
  islandFreeFlag,
  oreLeft,
  woodLeft,
  seedsLeft,
}: {
  islandOwnerName: string;
  islandOwnerExp: number;
  islandOwnerLevel: number;
  islandCoordinateX: number;
  islandCoordinateY: number;
  islandFreeFlag: boolean;
  oreLeft: number;
  woodLeft: number;
  seedsLeft: number;
}) {
  const resources = [
    { id: 1, title: "Ore", count: woodLeft, iconUrl: "/image/top-menu/ore_icon.png" },
    { id: 0, title: "Wood", count: oreLeft, iconUrl: "/image/top-menu/wood_icon.png" },
    { id: 2, title: "Seeds", count: seedsLeft, iconUrl: "/image/top-menu/seeds_icon.png" },
    { id: 3, title: "Boats", count: 0, iconUrl: "/image/top-menu/boats_icon.png" },
  ];

  return (
    <div className="w-full h-[160px] flex flex-col bg-top-menu-frame bg-center bg-no-repeat bg-cotain bg-[length:100%_100%] px-16 py-8 gap-6">
      <div className="flex justify-between items-center w-full h-1/2">
        {islandOwnerName && (
          <div className="flex items-center gap-2">
            <Image src="/image/top-menu/Avatar_pic.png" alt="avatar-pic" width={48} height={48} priority />
            <div className="text-xl text-white">{islandOwnerName}&apos;s island</div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Image src="/image/top-menu/points-icon.png" alt="points-icon" width={50} height={50} priority />
          <p className="text-white">Points: {islandOwnerExp}</p>
        </div>

        <div className="flex items-center gap-2">
          <Image src="/image/top-menu/points-icon.png" alt="points-icon" width={50} height={50} priority />
          <p className="text-white">Level: {islandOwnerLevel}</p>
        </div>

        {islandFreeFlag && <ClaimIslandForm coordinateX={islandCoordinateX} coordinateY={islandCoordinateY} />}
      </div>

      <div className="w-full h-1/2 flex justify-evenly items-center gap-4">
        {resources.map((resource) => (
          <div key={resource.id} className="flex items-center gap-1">
            <Image src={resource.iconUrl} alt="resource-icon" width={40} height={40} priority />
            <p className="text-white">
              {resource.title}: {resource.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
