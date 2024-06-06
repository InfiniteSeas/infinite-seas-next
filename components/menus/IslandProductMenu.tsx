"use client";

import { useState } from "react";
import Image from "next/image";

import StartProductForm from "@/components/form/StartProductForm";

export default function IslandProductMenu({
  productType,
  oreLeft,
  woodLeft,
  seedsLeft,
}: {
  productType: string;
  oreLeft: number;
  woodLeft: number;
  seedsLeft: number;
}) {
  const [modalFlag, setModalFlag] = useState<boolean>(false);

  const productImgs = {
    ore: "/image/product-menu/Mine_Unlocked.png",
    wood: "/image/product-menu/Tree_Unlocked.png",
    seed: "/image/product-menu/Cotton_Unlocked.png",
  } as any;

  const unlockedProductImgs = {
    ore: "/image/product-menu/Mine_Not_unlocked.png",
    wood: "/image/product-menu/Tree_Not_unlocked.png",
    seed: "/image/product-menu/Cotton_Not_unlocked.png",
  } as any;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5 h-3/5 z-40 grid grid-cols-4 gap-4">
      <div
        className="flex flex-col justify-center items-center bg-center bg-no-repeat bg-frame-lg bg-[length:100%_100%] text-white cursor-pointer gap-3"
        onClick={() => setModalFlag(true)}
      >
        {productType === "ore" && (
          <>
            <p className="text-lg">Mine Copper Ore</p>
            <div className="flex items-center gap-2">
              <p>10 XP /</p>
              <Image src="/image/product-menu/clock.png" alt="clock-icon" width={20} height={20} priority />
              <p>3 Seconds</p>
            </div>
          </>
        )}
        {productType === "wood" && (
          <>
            <p className="text-lg">Cut Normal Wood</p>
            <div className="flex items-center gap-2">
              <p>10 XP /</p>
              <Image src="/image/product-menu/clock.png" alt="clock-icon" width={20} height={20} priority />
              <p>3 Seconds</p>
            </div>
          </>
        )}
        {productType === "seed" && (
          <>
            <p className="text-lg">Plant Cotton Seeds</p>
            <div className="flex items-center gap-2">
              <p>10 XP /</p>
              <Image src="/image/product-menu/clock.png" alt="clock-icon" width={20} height={20} priority />
              <p>3 Seconds</p>
            </div>
          </>
        )}

        <Image src={productImgs[productType]} alt="product-icon" width={75} height={75} priority />

        <div className="text-center">
          <p>0 / 500</p>

          <div className="flex justify-between items-center gap-2">
            <Image src="/image/product-menu/trophy.png" alt="trophy-icon" width={20} height={20} priority />
            <Image
              src="/image/product-menu/Progressbar_Background.png"
              alt="progress-bg"
              width={150}
              height={10}
              priority
            />
          </div>
        </div>
      </div>

      {[10, 20, 30, 40, 50, 60, 70].map((id) => (
        <p
          key={id}
          className="flex flex-col justify-center items-center bg-center bg-no-repeat bg-frame-lg bg-[length:100%_100%] text-white cursor-pointer gap-6"
        >
          <div className="flex items-center gap-2">
            <Image src="/image/product-menu/Lock.png" alt="lock-icon" width={30} height={30} priority />
            <p className="text-2xl">Locked</p>
          </div>

          <Image src={unlockedProductImgs[productType]} alt="product-icon" width={75} height={75} priority />

          <p className="text-2xl">Level {id}</p>
        </p>
      ))}

      {modalFlag && (
        <StartProductForm
          productType={productType}
          oreLeft={oreLeft}
          woodLeft={woodLeft}
          seedsLeft={seedsLeft}
          handleCloseModal={() => setModalFlag(false)}
        />
      )}
    </div>
  );
}
