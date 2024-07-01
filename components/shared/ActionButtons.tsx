"use client";

import Image from "next/image";

export default function ActionButtons({ handleActionClick }: { handleActionClick: (flag: string) => void }) {
  const buttonData = [
    { id: 0, flag: "bag", count: "", iconUrl: "/image/button/Inventory.png" },
    { id: 1, flag: "ore", count: "", iconUrl: "/image/button/mine.png" },
    { id: 2, flag: "wood", count: "", iconUrl: "/image/button/cut.png" },
    { id: 3, flag: "seed", count: "", iconUrl: "/image/button/plant.png" },
    { id: 4, flag: "craft", count: "", iconUrl: "/image/button/craft.png" },
  ];

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-3/5 flex justify-end items-center gap-3 z-40">
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
