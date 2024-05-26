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
    <div className="w-full h-full absolute flex flex-col text-white">
      <div className="bg-[#343A40] px-4 py-2">
        <p>
          Space: {occupied}/{maxSpace}
        </p>
      </div>

      <div className="flex-1 grid grid-cols-10 bg-[#222A35] p-6 gap-6">
        {bagSpaces.map((space) => (
          <div
            key={space.id}
            className="w-full aspect-[1] rounded-lg border-2 border-transparent relative"
            style={{
              borderImage: "linear-gradient(to bottom right, #c0c0c0, #4f4f4f);",
              borderImageSlice: 1,
              background: "radial-gradient(circle, rgb(84, 84, 84) 0%, rgb(63, 63, 63) 100%)",
            }}
          >
            <p>{space.resource}</p>
            <p className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 rounded-lg bg-white text-black text-sm text-center px-2">
              {space.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
