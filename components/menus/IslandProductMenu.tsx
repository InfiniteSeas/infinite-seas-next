"use client";

import { useEffect, useState } from "react";

import StartProductForm from "@/components/form/StartProductForm";

export default function IslandProductMenu({
  productType,
  skillProcesses,
  oreLeft,
  woodLeft,
  seedsLeft,
}: {
  productType: string;
  skillProcesses: any[];
  oreLeft: number;
  woodLeft: number;
  seedsLeft: number;
}) {
  const [modalFlag, setModalFlag] = useState<boolean>(false);

  return (
    <div className="w-full h-full grid grid-cols-4 pt-4 gap-4">
      <p className="w-full h-full bg-black text-white cursor-pointer" onClick={() => setModalFlag(true)}>
        {productType}
      </p>

      {[2, 3, 4, 5, 6, 7, 8].map((id) => (
        <p key={id} className="w-full h-full bg-black text-white cursor-pointer">
          {id}
        </p>
      ))}

      {modalFlag && (
        <StartProductForm
          productType={productType}
          skillProcesses={skillProcesses}
          handleCloseModal={() => setModalFlag(false)}
          oreLeft={oreLeft}
          woodLeft={woodLeft}
          seedsLeft={seedsLeft}
        />
      )}
    </div>
  );
}
