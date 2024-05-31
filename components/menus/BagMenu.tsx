"use client";

import Image from "next/image";

export default function BagMenu({
  oreLeft,
  woodLeft,
  seedsLeft,
  copperLeft,
  logLeft,
  cottonLeft,
}: {
  oreLeft: number;
  woodLeft: number;
  seedsLeft: number;
  copperLeft: number;
  logLeft: number;
  cottonLeft: number;
}) {
  const bagSpaces = [
    { id: 0, count: oreLeft, iconUrl: "/image/top-menu/ore_icon.png" },
    { id: 1, count: woodLeft, iconUrl: "/image/top-menu/wood_icon.png" },
    { id: 2, count: seedsLeft, iconUrl: "/image/top-menu/seeds_icon.png" },
    { id: 3, count: copperLeft, iconUrl: "/image/product-menu/Mine_Unlocked.png" },
    { id: 4, count: logLeft, iconUrl: "/image/product-menu/Tree_Unlocked.png" },
    { id: 5, count: cottonLeft, iconUrl: "/image/product-menu/Cotton_Unlocked.png" },
    { id: 6, count: 0, iconUrl: "" },
    { id: 7, count: 0, iconUrl: "" },
    { id: 8, count: 0, iconUrl: "" },
    { id: 9, count: 0, iconUrl: "" },
    { id: 10, count: 0, iconUrl: "" },
    { id: 11, count: 0, iconUrl: "" },
    { id: 12, count: 0, iconUrl: "" },
    { id: 13, count: 0, iconUrl: "" },
    { id: 14, count: 0, iconUrl: "" },
    { id: 15, count: 0, iconUrl: "" },
    { id: 16, count: 0, iconUrl: "" },
    { id: 17, count: 0, iconUrl: "" },
    { id: 18, count: 0, iconUrl: "" },
    { id: 19, count: 0, iconUrl: "" },
  ];

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/5 z-40 flex flex-col bg-center bg-no-repeat bg-paper-row bg-[length:100%_100%] text-white flex-1 grid grid-cols-5 gap-6 p-12">
      {bagSpaces.map((space) => (
        <div
          key={space.id}
          className="w-full aspect-[1] relative flex justify-center items-center border-2 border-transparent bg-center bg-no-repeat bg-frame-sm bg-[length:100%_100%] cursor-pointer"
        >
          {space.iconUrl && <Image src={space.iconUrl} alt="resource-icon" width={40} height={40} priority />}
          <span className="absolute bottom-0 right-1 text-sm">{space.count}</span>
        </div>
      ))}
    </div>
  );
}
