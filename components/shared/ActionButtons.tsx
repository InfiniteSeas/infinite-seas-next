"use client";

import Image from "next/image";

export default function ActionButtons({ handleActionClick }: { handleActionClick: (flag: string) => void }) {
  const buttonData = [
    { id: 0, flag: "bag", count: "", iconUrl: "/image/button/Inventory.png" },
    { id: 1, flag: "ore", count: "7/99", iconUrl: "/image/button/mining.png" },
    { id: 2, flag: "wood", count: "29/99", iconUrl: "/image/button/wood-cutting.png" },
    { id: 3, flag: "seed", count: "30/99", iconUrl: "/image/button/Planting.png" },
    { id: 4, flag: "craft", count: "", iconUrl: "/image/button/Crafting.png" },
  ];

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-3/5 flex justify-end items-center gap-3">
      {buttonData.map((data) => (
        <div
          key={data.id}
          className="w-[120px] h-[120px] relative cursor-pointer bg-frame-normal bg-center bg-no-repeat bg-contain"
          onClick={() => handleActionClick(data.flag)}
        >
          <Image
            className="absolute top-1/2 left-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2"
            src={data.iconUrl}
            alt="btn-pic"
            width={170}
            height={270}
            priority
          />

          {data.count && <p className="absolute bottom-3 right-4 text-sm text-white">{data.count}</p>}
        </div>
      ))}
    </div>
  );
}
