"use client";

import { useState } from "react";

export default function IslandProductMenu({ productType }: { productType: string }) {
  const [modalFlag, setModalFlag] = useState<boolean>(false);
  const [energyTokenCost, setEnergyTokenCost] = useState<string>("");

  function handleProductCreate() {}

  return (
    <div className="w-full h-full grid grid-cols-4 pt-4 gap-4">
      <p className="w-1/5 h-[45%] bg-black text-white cursor-pointer" onClick={() => setModalFlag(true)}>
        {productType}
      </p>

      {[2, 3, 4, 5, 6, 7, 8].map((id) => (
        <p key={id} className="w-1/5 h-[45%] bg-black text-white cursor-pointer">
          {id}
        </p>
      ))}

      {modalFlag && (
        <div className="w-[270px] h-[180px] flex flex-col justify-between items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-lg p-4">
          <div>
            <span>{productType}</span>
            <input
              className="w-[45px]"
              type="text"
              value={energyTokenCost}
              onChange={(e) => setEnergyTokenCost(e.target.value)}
            />
          </div>

          <p>costs {energyTokenCost} energy token</p>

          <p>
            {productType === "iron"
              ? Number(energyTokenCost) * 3
              : productType === "wood"
              ? Number(energyTokenCost) * 8
              : Number(energyTokenCost) * 36}
            seconds time duration
          </p>

          <div className="flex w-4/5 justify-evenly items-center">
            <div
              className="hover:bg-[#e9e9e9] border-[1px] border-black rounded-lg p-2 cursor-pointer"
              onClick={handleProductCreate}
            >
              Create
            </div>

            <div
              className="hover:bg-[#e9e9e9] border-[1px] border-black rounded-lg p-2 cursor-pointer"
              onClick={() => {
                setModalFlag(false);
                setEnergyTokenCost("");
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
