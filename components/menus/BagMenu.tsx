"use client";

import { useState } from "react";

export default function BagMenu({ maxSpace }: { maxSpace: number }) {
  const [occupied, setOccupied] = useState<number>(0);

  const bagSpaces = [
    { id: 0, resource: "Ore", count: 0, iconUrl: "" },
    { id: 1, resource: "Wood", count: 0, iconUrl: "" },
    { id: 2, resource: "Seed", count: 0, iconUrl: "" },
    { id: 3, resource: "", count: 0, iconUrl: "" },
    { id: 4, resource: "", count: 0, iconUrl: "" },
    { id: 5, resource: "", count: 0, iconUrl: "" },
    { id: 6, resource: "", count: 0, iconUrl: "" },
    { id: 7, resource: "", count: 0, iconUrl: "" },
    { id: 8, resource: "", count: 0, iconUrl: "" },
    { id: 9, resource: "", count: 0, iconUrl: "" },
    { id: 10, resource: "", count: 0, iconUrl: "" },
    { id: 11, resource: "", count: 0, iconUrl: "" },
    { id: 12, resource: "", count: 0, iconUrl: "" },
    { id: 13, resource: "", count: 0, iconUrl: "" },
    { id: 14, resource: "", count: 0, iconUrl: "" },
    { id: 15, resource: "", count: 0, iconUrl: "" },
    { id: 16, resource: "", count: 0, iconUrl: "" },
    { id: 17, resource: "", count: 0, iconUrl: "" },
    { id: 18, resource: "", count: 0, iconUrl: "" },
    { id: 19, resource: "", count: 0, iconUrl: "" },
  ];

  return (
    <div className="w-2/3 absolute left-1/2 -translate-x-1/2 h-full flex flex-col bg-center bg-no-repeat bg-bag-bg bg-[length:100%_100%] text-white flex-1 grid grid-cols-5 gap-6 p-12">
      {bagSpaces.map((space) => (
        <div
          key={space.id}
          className="w-full aspect-[1] relative border-2 border-transparent bg-center bg-no-repeat bg-bag-frame bg-[length:100%_100%] cursor-pointer"
        >
          <p className="absolute left-1/2 bottom-1 -translate-x-1/2 translate-y-1/2 rounded-full bg-zinc-600 text-xs text-center px-2">
            {space.count}
          </p>
        </div>
      ))}
    </div>
  );
}
