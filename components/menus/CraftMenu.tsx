"use client";

import { useState } from "react";
import Image from "next/image";

export default function CraftMenu() {
  const [modalFlag, setModalFlag] = useState<boolean>(false);

  const [shipOre, setShipOre] = useState<number>(3);
  const [shipWood, setShipWood] = useState<number>(3);
  const [shipSeed, setShipSeed] = useState<number>(3);
  const [attack, setAttack] = useState<number>(6);
  const [protection, setProtection] = useState<number>(5);
  const [speed, setSpeed] = useState<number>(4);
  const [inventoryOre, setInventoryOre] = useState<number>(0);
  const [inventoryWood, setInventoryWood] = useState<number>(0);
  const [inventorySeed, setInventorySeed] = useState<number>(0);

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
    if (shipOre + shipWood + shipSeed >= 15 || inventoryOre === 0) return;

    setShipOre((prev) => ++prev);
    setAttack((prev) => ++prev);
    setInventoryOre((prev) => --prev);
  }

  function addWood() {
    if (shipOre + shipWood + shipSeed >= 15 || inventoryWood === 0) return;

    setShipWood((prev) => ++prev);
    setProtection((prev) => ++prev);
    setInventoryWood((prev) => --prev);
  }
  function addSeed() {
    if (shipOre + shipWood + shipSeed >= 15 || inventorySeed === 0) return;

    setShipSeed((prev) => ++prev);
    setSpeed((prev) => ++prev);
    setInventorySeed((prev) => --prev);
  }

  function removeOre() {
    if (shipOre <= 3) return;

    setShipOre((prev) => --prev);
    setAttack((prev) => --prev);
    setInventoryOre((prev) => ++prev);
  }

  function removeWood() {
    if (shipWood <= 3) return;

    setShipWood((prev) => --prev);
    setProtection((prev) => --prev);
    setInventoryWood((prev) => ++prev);
  }

  function removeSeed() {
    if (shipSeed <= 3) return;

    setShipSeed((prev) => --prev);
    setSpeed((prev) => --prev);
    setInventorySeed((prev) => ++prev);
  }

  return (
    <div className="w-full h-full flex absolute" style={{ height: "112%" }}>
      <div
        className="w-1/5 flex flex-col items-center py-6 gap-4 "
        style={{
          background: `url("/image/15-Crafting/background_height.png")`,
          backgroundSize: "100% 100%",
          lineHeight: "45px",
          padding: "20px",
        }}
      >
        {sidebarTitle.map((title, index) => (
          <p
            key={title}
            className={`h-[45px] ${index === 0 ? "text-[#B30000]" : "text-white"} cursor-pointer text-center`}
            style={{
              background: `url("/image/15-Crafting/left_box.png")`,
              backgroundSize: "100% 100%",
              width: "100%",
              height: "50px",
            }}
          >
            {title}
          </p>
        ))}
      </div>

      <div
        className="flex-1 flex flex-col items-center gap-6 py-6 px-10"
        style={{ background: `url("/image/15-Crafting/background_width.png")`, backgroundSize: "100% 100%" }}
      >
        {/* <h1 className="text-3xl font-bold py-2">Crafting</h1> */}

        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className="flex justify-center items-center"
              style={{
                background: `url("/image/15-Crafting/center_box2.png")`,
                backgroundSize: "100% 100%",
                width: "170px",
                height: "170px",
              }}
            >
              <Image src="/image/Ocean/Boat_small.png" alt="small-boat" width={60} height={100} priority />
            </div>
          </div>

          <div
            className="text-sm  text-white flex justify-between items-center"
            style={{
              background: `url("/image/15-Crafting/center_box.png")`,
              width: "60%",
              height: "140px",
              backgroundSize: "100% 100%",
              padding: "20px 30px",
            }}
          >
            <div className="font-bold flex flex-col justify-evenly" style={{ height: "100%" }}>
              <p className="text-xl">
                small ship
                <img src="/image/15-Crafting/center_line.png" />
              </p>
              <p>Require : 15 Resources</p>
              <p>Cost : 5 Energy</p>
            </div>
            <div>
              <p>
                <img
                  src="/image/15-Crafting/ATK_icon.png"
                  style={{ height: "15px", width: "15px", display: "inline-block" }}
                />{" "}
                attack: {attack}
              </p>
              <p>
                <img
                  src="/image/15-Crafting/DEF_icon.png"
                  style={{ height: "15px", width: "15px", display: "inline-block" }}
                />
                protection: {protection}
              </p>
              <p>
                <img
                  src="/image/15-Crafting/speed_icon.png"
                  style={{ height: "15px", width: "15px", display: "inline-block" }}
                />
                speed: {speed}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex text-xl text-white justify-center" style={{ flexWrap: "wrap" }}>
          <div
            className="w-full aspect-[1] cursor-pointer flex relative justify-center items-center"
            onClick={removeOre}
            style={{
              background: `url("/image/15-Crafting/center_box2.png")`,
              backgroundSize: "100% 100%",
              padding: "0 15px",
              height: "100px",
              width: "105px",
            }}
          >
            <img src="/image/15-Crafting/ore_icon.png" style={{ height: "60%" }} />
            <p className="absolute" style={{ right: "20px", bottom: "10px" }}>
              {shipOre}
            </p>
          </div>
          <div
            className="w-full aspect-[1] cursor-pointer flex relative justify-center items-center"
            onClick={removeWood}
            style={{
              background: `url("/image/15-Crafting/center_box2.png")`,
              backgroundSize: "100% 100%",
              padding: "0 15px",
              height: "100px",
              width: "105px",
            }}
          >
            <img src="/image/15-Crafting/wood_icon.png" style={{ height: "50%" }} />
            <p className="absolute" style={{ right: "20px", bottom: "10px" }}>
              {shipWood}
            </p>
          </div>
          <div
            className="w-full aspect-[1] cursor-pointer flex relative justify-center items-center"
            onClick={removeSeed}
            style={{
              background: `url("/image/15-Crafting/center_box2.png")`,
              backgroundSize: "100% 100%",
              padding: "0 15px",
              height: "100px",
              width: "105px",
            }}
          >
            <img src="/image/15-Crafting/Cotton_Unlocked.png" style={{ height: "50%" }} />
            <p className="absolute" style={{ right: "20px", bottom: "10px" }}>
              {shipSeed}
            </p>
          </div>
          {[0, 1, 2, 3, 4, 5, 6].map((id) => (
            <div
              key={id}
              className="w-full aspect-[1]  cursor-pointer"
              style={{
                background: `url("/image/15-Crafting/center_box2.png")`,
                backgroundSize: "100% 100%",
                padding: "0 15px",
                height: "100px",
                width: "105px",
              }}
            />
          ))}
        </div>

        <div className="w-full flex justify-end">
          <div
            className="text-xl text-center cursor-pointer px-4 py-2 "
            onClick={() => setModalFlag(true)}
            style={{
              background: `url('/image/15-Crafting/Craft.png') no-repeat`,
              backgroundSize: "100% 100%",
              width: "200px",
              height: "60px",
            }}
          ></div>
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

      <div
        className="w-1/5 flex flex-col items-center py-6 gap-4"
        style={{ background: `url("/image/15-Crafting/background_height.png")`, backgroundSize: "100% 100%" }}
      >
        <p
          className="text-xl text-white text-center"
          style={{
            background: `url("/image/15-Crafting/center_box.png")`,
            width: "60%",
            height: "50px",
            backgroundSize: "100% 100%",
            lineHeight: "50px",
          }}
        >
          inventory
        </p>

        <div className="w-full grid  px-6 gap-4" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <div
            className="w-full  relative   text-white flex justify-center items-center"
            style={{
              borderImageSlice: 1,
              background: `url("/image/15-Crafting/center_box2.png")`,
              backgroundSize: "100% 100%",
            }}
            onClick={addmining}
          >
            <img src="/image/15-Crafting/ore_icon.png" style={{ height: "60%" }} />
            <p className="absolute" style={{ right: "20px", bottom: "10px" }}>
              {inventoryOre}
            </p>
          </div>

          <div
            className="w-full aspect-[1] relative rounded-md text-white flex justify-center items-center"
            style={{
              borderImageSlice: 1,
              background: `url("/image/15-Crafting/center_box2.png")`,
              backgroundSize: "100% 100%",
            }}
            onClick={addWood}
          >
            <img src="/image/15-Crafting/wood_icon.png" style={{ height: "50%" }} />
            <p className="absolute" style={{ right: "20px", bottom: "10px" }}>
              {inventoryWood}
            </p>
          </div>

          <div
            className="w-full aspect-[1] relative  rounded-md text-white flex justify-center items-center"
            style={{
              borderImageSlice: 1,
              background: `url("/image/15-Crafting/center_box2.png")`,
              backgroundSize: "100% 100%",
            }}
            onClick={addSeed}
          >
            <img src="/image/15-Crafting/Cotton_Unlocked.png" style={{ height: "50%" }} />
            <p className="absolute" style={{ right: "20px", bottom: "10px" }}>
              {inventorySeed}
            </p>
          </div>

          {[0, 1, 2, 3, 4].map((id) => (
            <div
              key={id}
              className="w-full aspect-[1] relative rounded-md text-white flex justify-center items-center"
              style={{
                borderImageSlice: 1,
                background: `url("/image/15-Crafting/center_box2.png")`,
                backgroundSize: "100% 100%",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
