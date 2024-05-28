"use client";

import { useState } from "react";
import Image from "next/image";

import StartCraftForm from "@/components/form/StartCraftForm";

export default function CraftMenu({
  copperLeft,
  logLeft,
  cottonLeft,
  skillProcesses,
}: {
  copperLeft: number;
  logLeft: number;
  cottonLeft: number;
  skillProcesses: any[];
}) {
  const [modalFlag, setModalFlag] = useState<boolean>(false);

  const [shipCopper, setShipCopper] = useState<number>(3);
  const [shipLog, setShipLog] = useState<number>(3);
  const [shipCotton, setShipCotton] = useState<number>(3);
  const [attack, setAttack] = useState<number>(6);
  const [protection, setProtection] = useState<number>(5);
  const [speed, setSpeed] = useState<number>(4);
  const [inventoryCopper, setInventoryCopper] = useState<number>(copperLeft);
  const [inventoryLog, setInventoryLog] = useState<number>(logLeft);
  const [inventoryCotton, setInventoryCotton] = useState<number>(cottonLeft);

  const sidebarTitle = [
    "small ship",
    "Unlocked at Level 9",
    "Unlocked at Level 14",
    "Unlocked at Level 24",
    "Unlocked at Level 33",
    "Unlocked at Level 44",
  ];

  function addmining() {
    if (shipCopper + shipLog + shipCotton >= 15 || inventoryCopper === 0) return;

    setShipCopper((prev) => ++prev);
    setAttack((prev) => ++prev);
    setInventoryCopper((prev) => --prev);
  }

  function addLog() {
    if (shipCopper + shipLog + shipCotton >= 15 || inventoryLog === 0) return;

    setShipLog((prev) => ++prev);
    setProtection((prev) => ++prev);
    setInventoryLog((prev) => --prev);
  }
  function addCotton() {
    if (shipCopper + shipLog + shipCotton >= 15 || inventoryCotton === 0) return;

    setShipCotton((prev) => ++prev);
    setSpeed((prev) => ++prev);
    setInventoryCotton((prev) => --prev);
  }

  function removeCopper() {
    if (shipCopper <= 3) return;

    setShipCopper((prev) => --prev);
    setAttack((prev) => --prev);
    setInventoryCopper((prev) => ++prev);
  }

  function removeLog() {
    if (shipLog <= 3) return;

    setShipLog((prev) => --prev);
    setProtection((prev) => --prev);
    setInventoryLog((prev) => ++prev);
  }

  function removeCotton() {
    if (shipCotton <= 3) return;

    setShipCotton((prev) => --prev);
    setSpeed((prev) => --prev);
    setInventoryCotton((prev) => ++prev);
  }

  return (
    <div className="w-full h-full flex absolute">
      <div className="w-1/5 flex flex-col items-center bg-[#232A35] py-6 gap-4">
        {sidebarTitle.map((title, index) => (
          <p key={title} className={`h-[45px] ${index === 0 ? "text-[#B30000]" : "text-white"} cursor-pointer`}>
            {title}
          </p>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center bg-[#D9D9D9] gap-6 py-6 px-10">
        <h1 className="text-3xl font-bold py-2">Crafting</h1>

        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/image/Ocean/Boat_small.png" alt="small-boat" width={60} height={100} priority />
            <div className="text-xl font-bold">small ship</div>
          </div>

          <div className="text-xl">
            <p>attack: {attack}</p>
            <p>protection: {protection}</p>
            <p>speed: {speed}</p>
          </div>
        </div>

        <div className="w-full grid grid-cols-7 gap-4 text-xl">
          <div className="w-full aspect-[1] bg-[#A1A1A1] cursor-pointer" onClick={removeCopper}>
            Copper required x{shipCopper}
          </div>
          <div className="w-full aspect-[1] bg-[#A1A1A1] cursor-pointer" onClick={removeLog}>
            Log required x{shipLog}
          </div>
          <div className="w-full aspect-[1] bg-[#A1A1A1] cursor-pointer" onClick={removeCotton}>
            Cotton required x{shipCotton}
          </div>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((id) => (
            <div key={id} className="w-full aspect-[1] bg-[#A1A1A1] cursor-pointer" />
          ))}
        </div>

        <div className="w-full flex justify-end">
          <div className="bg-[#A1A1A1] text-xl text-center cursor-pointer px-4 py-2" onClick={() => setModalFlag(true)}>
            Craft
          </div>
        </div>

        {modalFlag && (
          <StartCraftForm
            copper={shipCopper}
            log={shipLog}
            cotton={shipCotton}
            skillProcesses={skillProcesses}
            handleCloseModal={() => setModalFlag(false)}
          />
        )}
      </div>

      <div className="w-1/5 flex flex-col items-center bg-[#BEBEBE] py-6 gap-4">
        <p className="text-xl">inventory</p>

        <div className="w-full grid grid-cols-3 px-6 gap-4">
          <div
            className="w-full aspect-[1] relative border-2 border-transparent rounded-md text-white cursor-pointer"
            style={{
              borderImage: "linear-gradient(to bottom right, #c0c0c0, #4f4f4f);",
              borderImageSlice: 1,
              background: "radial-gradient(circle, rgb(84, 84, 84) 0%, rgb(63, 63, 63) 100%)",
            }}
            onClick={addmining}
          >
            Copper {inventoryCopper}
          </div>

          <div
            className="w-full aspect-[1] relative border-2 border-transparent rounded-md text-white cursor-pointer"
            style={{
              borderImage: "linear-gradient(to bottom right, #c0c0c0, #4f4f4f);",
              borderImageSlice: 1,
              background: "radial-gradient(circle, rgb(84, 84, 84) 0%, rgb(63, 63, 63) 100%)",
            }}
            onClick={addLog}
          >
            Log {inventoryLog}
          </div>

          <div
            className="w-full aspect-[1] relative border-2 border-transparent rounded-md text-white cursor-pointer"
            style={{
              borderImage: "linear-gradient(to bottom right, #c0c0c0, #4f4f4f);",
              borderImageSlice: 1,
              background: "radial-gradient(circle, rgb(84, 84, 84) 0%, rgb(63, 63, 63) 100%)",
            }}
            onClick={addCotton}
          >
            Cotton {inventoryCotton}
          </div>

          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
            <div
              key={id}
              className="w-full aspect-[1] relative border-2 border-transparent rounded-md text-white cursor-pointer"
              style={{
                borderImage: "linear-gradient(to bottom right, #c0c0c0, #4f4f4f);",
                borderImageSlice: 1,
                background: "radial-gradient(circle, rgb(84, 84, 84) 0%, rgb(63, 63, 63) 100%)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
