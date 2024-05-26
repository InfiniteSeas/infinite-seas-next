"use client";

import Image from "next/image";

export default function IslandButtons({ handleButtonClick }: { handleButtonClick: (flag: string) => void }) {
  const buttonData = [
    { id: 0, flag: "bag", count: "", iconUrl: "/image/btn/Inventory.png" },
    { id: 1, flag: "ore", count: "7/99", iconUrl: "/image/btn/mining.png" },
    { id: 2, flag: "wood", count: "29/99", iconUrl: "/image/btn/wood-cutting.png" },
    { id: 3, flag: "seed", count: "30/99", iconUrl: "/image/btn/Planting.png" },
    { id: 4, flag: "craft", count: "", iconUrl: "/image/btn/Crafting.png" },
  ];

  return (
    <div className="w-full h-1/5 flex justify-end items-center gap-3">
      {buttonData.map((data) => (
        <div
          key={data.id}
          className="w-[14%] h-full relative cursor-pointer bg-btn-frame bg-center bg-no-repeat bg-contain"
          onClick={() => handleButtonClick(data.flag)}
        >
          <Image
            className="absolute top-1/2 left-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2"
            src={data.iconUrl}
            alt="btn-pic"
            width={170}
            height={270}
            priority
          />

          {data.count && <p className="absolute bottom-16 right-8 text-white">{data.count}</p>}
        </div>
      ))}
    </div>
  );
}
