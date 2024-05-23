"use client";

import Image from "next/image";

export default function IslandTopbar() {
  const resources = [
    { id: 0, title: "wood", count: 200, iconUrl: "/image/topMenu/wood_icon.png" },
    { id: 1, title: "ore", count: 80, iconUrl: "/image/topMenu/ore_icon.png" },
    { id: 2, title: "seeds", count: 200, iconUrl: "/image/topMenu/seeds_icon.png" },
    { id: 3, title: "boats", count: 0, iconUrl: "/image/topMenu/boats_icon.png" },
  ];

  return (
    <div className="w-full h-1/5 p-6">
      <div className="w-full h-full bg-black">
        <div className="flex justify-between items-center w-full h-1/2">
          <div className="flex items-center gap-2">
            <Image src="/image/topMenu/Avatar_pic.png" alt="avatar-pic" width={60} height={60} priority />
            <div className="text-xl text-white">John&apos;s island</div>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/image/topMenu/points-icon.png" alt="points-icon" width={50} height={50} priority />
            <p className="text-white">points：0</p>
          </div>
        </div>

        <div className="w-full h-1/2 flex justify-between items-center gap-4 px-6">
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
    </div>
  );
}
