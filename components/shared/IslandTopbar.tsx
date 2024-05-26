"use client";

import Image from "next/image";

import ClaimIslandForm from "@/components/form/ClaimIslandForm";

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
    { id: 1, title: "Ore", count: woodLeft, iconUrl: "/image/topMenu/ore_icon.png" },
    { id: 0, title: "Wood", count: oreLeft, iconUrl: "/image/topMenu/wood_icon.png" },
    { id: 2, title: "Seeds", count: seedsLeft, iconUrl: "/image/topMenu/seeds_icon.png" },
    { id: 3, title: "Boats", count: 0, iconUrl: "/image/topMenu/boats_icon.png" },
  ];

  return (
    <div className="w-full h-1/6 bg-black px-12 py-6">
      <div className="flex justify-between items-center w-full h-1/2">
        <div className="flex items-center gap-2">
          <Image src="/image/topMenu/Avatar_pic.png" alt="avatar-pic" width={60} height={60} priority />
          <div className="text-xl text-white">{islandOwnerName}&apos;s island</div>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/image/topMenu/points-icon.png" alt="points-icon" width={50} height={50} priority />
          <p className="text-white">Exp: {islandOwnerExp}</p>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/image/topMenu/points-icon.png" alt="points-icon" width={50} height={50} priority />
          <p className="text-white">Level: {islandOwnerLevel}</p>
        </div>
        <ClaimIslandForm />
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
