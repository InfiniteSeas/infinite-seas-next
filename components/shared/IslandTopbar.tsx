"use client";

import Image from "next/image";

export default function IslandTopbar({
  islandOwnerName,
  islandOwnerExp,
  islandOwnerLevel,
  oreLeft,
  woodLeft,
  seedsLeft,
}: {
  islandOwnerName: string;
  islandOwnerExp: number;
  islandOwnerLevel: number;
  oreLeft: number;
  woodLeft: number;
  seedsLeft: number;
}) {
  const resources = [
    { id: 1, title: "Ore", count: oreLeft, iconUrl: "/image/topbar/ore.png" },
    { id: 0, title: "Wood", count: woodLeft, iconUrl: "/image/topbar/wood.png" },
    { id: 2, title: "Seeds", count: seedsLeft, iconUrl: "/image/topbar/seeds.png" },
    { id: 3, title: "Boats", count: 0, iconUrl: "/image/topbar/boat.png" },
  ];

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 w-3/5 h-[150px] flex flex-col bg-frame-topbar bg-center bg-no-repeat bg-cotain bg-[length:100%_100%] px-16 py-8 gap-6">
      <div className="flex justify-between items-center w-full h-1/2">
        {islandOwnerName && (
          <div className="flex items-center gap-2">
            <Image src="/image/topbar/avatar.png" alt="avatar-pic" width={48} height={48} priority />
            <div className="text-xl text-white">{islandOwnerName}&apos;s island</div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Image src="/image/topbar/points.png" alt="points" width={50} height={50} priority />
          <p className="text-white">Points: {islandOwnerExp}</p>
        </div>

        <div className="flex items-center gap-2">
          <Image src="/image/topbar/points.png" alt="points" width={50} height={50} priority />
          <p className="text-white">Level: {islandOwnerLevel}</p>
        </div>
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
