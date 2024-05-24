"use client";

import Image from "next/image";

export default function IslandButtons({ handleButtonClick }: { handleButtonClick: (flag: string) => void }) {
  const products = [
    { id: 0, flag: "iron", count: "7/99", iconUrl: "/image/btn/mining.png" },
    { id: 1, flag: "wood", count: "29/99", iconUrl: "/image/topMenu/wood-cutting.png" },
    { id: 2, flag: "cotton", count: "30/99", iconUrl: "/image/topMenu/Planting.png" },
  ];

  return (
    <div className="w-full h-1/5 flex justify-between items-center">
      <div className="w-[14%] h-full relative cursor-pointer bg-btn-frame" onClick={() => handleButtonClick("bag")}>
        <Image
          className="absolute top-1/2 left-1/2 w-[60%] h-[60%] -translate-x-1/2 -translate-y-1/2"
          src="/image/btn/Inventory.png"
          alt="inventory-pic"
          width={170}
          height={270}
          priority
        />
      </div>

      <div className="flex items-center gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[14%] h-full relative cursor-pointer bg-btn-frame"
            onClick={() => handleButtonClick(product.flag)}
          >
            <Image
              className="absolute top-1/2 left-1/2 w-[60%] h-[60%] -translate-x-1/2 -translate-y-1/2"
              src={product.iconUrl}
              alt="product-pic"
              width={170}
              height={270}
            />
            <p className="absolute bottom-1 right-1 text-white">{product.count}</p>
          </div>
        ))}
      </div>

      <div className="w-[14%] h-full relative cursor-pointer bg-btn-frame" onClick={() => handleButtonClick("craft")}>
        <Image
          className="absolute top-1/2 left-1/2 w-[60%] h-[60%] -translate-x-1/2 -translate-y-1/2"
          src="/image/topMenu/Crafting.png"
          alt="crafting-pic"
          width={170}
          height={270}
          priority
        />
      </div>
    </div>
  );
}
