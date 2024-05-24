"use client";

import { useState } from "react";
import Image from "next/image";

export default function CraftMenu() {
  const [modalFlag, setModalFlag] = useState<boolean>(false);

  const [shipIron, setShipIron] = useState<number>(3);
  const [shipWood, setShipWood] = useState<number>(3);
  const [shipCotton, setShipCotton] = useState<number>(3);
  const [attack, setAttack] = useState<number>(6);
  const [protection, setProtection] = useState<number>(5);
  const [speed, setSpeed] = useState<number>(4);
  const [inventoryIron, setInventoryIron] = useState<number>(0);
  const [inventoryWood, setInventoryWood] = useState<number>(0);
  const [inventoryCotton, setInventoryCotton] = useState<number>(0);

  const sidebarTitle = [
    "small ship",
    "Unlocked at Level 9",
    "Unlocked at Level 14",
    "Unlocked at Level 24",
    "Unlocked at Level 33",
    "Unlocked at Level 44",
  ];

  function createCraft() {}

  function addmining() {
    if (shipIron + shipWood + shipCotton >= 15 || inventoryIron === 0) return;

    setShipIron((prev) => ++prev);
    setAttack((prev) => ++prev);
    setInventoryIron((prev) => --prev);
  }

  function addWood() {
    if (shipIron + shipWood + shipCotton >= 15 || inventoryWood === 0) return;

    setShipWood((prev) => ++prev);
    setProtection((prev) => ++prev);
    setInventoryWood((prev) => --prev);
  }
  function addcotton() {
    if (shipIron + shipWood + shipCotton >= 15 || inventoryCotton === 0) return;

    setShipCotton((prev) => ++prev);
    setSpeed((prev) => ++prev);
    setInventoryCotton((prev) => --prev);
  }

  function removeIron() {
    if (shipIron <= 3) return;

    setShipIron((prev) => --prev);
    setAttack((prev) => --prev);
    setInventoryIron((prev) => ++prev);
  }

  function removeWood() {
    if (shipWood <= 3) return;

    setShipWood((prev) => --prev);
    setProtection((prev) => --prev);
    setInventoryWood((prev) => ++prev);
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
          <div className="w-full aspect-[1] bg-[#A1A1A1] cursor-pointer" onClick={removeIron}>
            iron required x{shipIron}
          </div>
          <div className="w-full aspect-[1] bg-[#A1A1A1] cursor-pointer" onClick={removeWood}>
            wood required x{shipWood}
          </div>
          <div className="w-full aspect-[1] bg-[#A1A1A1] cursor-pointer" onClick={removeCotton}>
            cotton required x{shipCotton}
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
          <div className="w-[270px] h-[180px] flex flex-col justify-between items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-lg p-4">
            <div className="flex items-center gap-2">
              <span>small ship</span>
              <input className="w-[45px] border-[1px] text-center rounded-md" type="text" value="1" disabled />
            </div>
            <p>costs 5 energy token</p>
            <p>15 seconds time duration</p>

            <div className="w-4/5 flex justify-evenly items-center">
              <div className="hover:bg-[#e9e9e9] border-[1px] rounded-md cursor-pointer p-1" onClick={createCraft}>
                Create
              </div>
              <div
                className="hover:bg-[#e9e9e9] border-[1px] rounded-md cursor-pointer p-1"
                onClick={() => setModalFlag(false)}
              >
                Cancel
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-1/5 flex flex-col items-center bg-[#BEBEBE] py-6 gap-4">
        <p className="text-xl">inventory</p>

        <div className="w-full grid grid-cols-3 px-6 gap-4">
          <div
            className="w-full aspect-[1] relative border-2 border-transparent rounded-md text-white"
            style={{
              borderImage: "linear-gradient(to bottom right, #c0c0c0, #4f4f4f);",
              borderImageSlice: 1,
              background: "radial-gradient(circle, rgb(84, 84, 84) 0%, rgb(63, 63, 63) 100%)",
            }}
            onClick={addmining}
          >
            iron {inventoryIron}
          </div>

          <div
            className="w-full aspect-[1] relative border-2 border-transparent rounded-md text-white"
            style={{
              borderImage: "linear-gradient(to bottom right, #c0c0c0, #4f4f4f);",
              borderImageSlice: 1,
              background: "radial-gradient(circle, rgb(84, 84, 84) 0%, rgb(63, 63, 63) 100%)",
            }}
            onClick={addWood}
          >
            Wood {inventoryWood}
          </div>

          <div
            className="w-full aspect-[1] relative border-2 border-transparent rounded-md text-white"
            style={{
              borderImage: "linear-gradient(to bottom right, #c0c0c0, #4f4f4f);",
              borderImageSlice: 1,
              background: "radial-gradient(circle, rgb(84, 84, 84) 0%, rgb(63, 63, 63) 100%)",
            }}
            onClick={addcotton}
          >
            cotton {inventoryCotton}
          </div>

          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
            <div
              key={id}
              className="w-full aspect-[1] relative border-2 border-transparent rounded-md text-white"
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
