"use client";

import { useEffect, useState } from "react";

import StartCreationForm from "@/components/form/StartCreationForm";

export default function IslandProductMenu({
  productType,
  skillProcesses,
}: {
  productType: string;
  skillProcesses: any[];
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
        <StartCreationForm
          productType={productType}
          skillProcesses={skillProcesses}
          handleCloseModal={() => setModalFlag(false)}
        />
      )}
    </div>
  );
}
