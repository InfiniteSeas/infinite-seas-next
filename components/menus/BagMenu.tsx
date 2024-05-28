"use client";

import { useState } from "react";

export default function BagMenu({ maxSpace }: { maxSpace: number }) {
  const [occupied, setOccupied] = useState<number>(0);

  const bagSpaces = [
    { id: 0, resource: "Ore", count: 0, iconUrl: "" },
    { id: 1, resource: "Wood", count: 0, iconUrl: "" },
    { id: 2, resource: "Seed", count: 0, iconUrl: "" },
  ];

  return (
    <div className="w-full h-full absolute flex flex-col text-black bg-no-repeat bg-contain " style={{backgroundImage:`url('/image/14-Inventory/background.png')`,padding:'30px',backgroundSize:"100% 100%"}}>
      <div className="px-4 py-2">
        <p>
          Space: {occupied}/{maxSpace}
        </p>
      </div>

      <div className="flex-1 grid grid-cols-10  p-6 gap-6">
        {bagSpaces.map((space) => (
          <div
            key={space.id}
            className="w-full aspect-[1] rounded-lg border-transparent relative bg-no-repeat bg-contain text-white"
            style={{
              borderImageSlice: 1,
              backgroundSize:"100% 100%",
              background: `url("/image/14-Inventory/box.png")`,
            }}
          >
            <p>{space.resource}</p>
            <p className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 rounded-lg bg-white text-black text-sm text-center px-2">
              {space.count}
            </p>
          </div>
        ))}
        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((space) => (
          <div
            className="w-full aspect-[1] rounded-lg border-transparent relative bg-no-repeat bg-contain  text-white"
            style={{
              borderImageSlice: 1,
              backgroundSize:"100% 100%",
              background: `url("/image/14-Inventory/box.png")`,
            }}
          >
            <p className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 rounded-lg bg-white text-black text-sm text-center px-2">
             
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
