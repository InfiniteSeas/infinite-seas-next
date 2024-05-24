"use client";

import { useState } from "react";
import Image from "next/image";

export default function ShipsMenu({ closeShipsMenu }: { closeShipsMenu: () => void }) {
  const [shipsBagBackg, setShipsBagBackg] = useState<boolean>(false);

  const shipsTopData = [
    { id: 0, title: "All" },
    { id: 1, title: "Roster1" },
    { id: 2, title: "Roster2" },
    { id: 3, title: "Roster3" },
    { id: 4, title: "Roster4" },
    { id: 5, title: "Unassigned" },
  ];

  const ships = [
    { id: 1, iconUrl: "/image/Ocean/Boat_big.png", name: "001", ID: "001", HP: "20/20" },
    { id: 2, iconUrl: "/image/Ocean/Boat_big.png", name: "001", ID: "001", HP: "20/20" },
    { id: 3, iconUrl: "/image/Ocean/Boat_big.png", name: "001", ID: "001", HP: "20/20" },
  ];

  const shipInventories = [
    { id: 1, iconUrl: "/image/Ocean/Boat_big.png", name: "SHIP ONE" },
    { id: 2, iconUrl: "/image/Ocean/Boat_big.png", name: "SHIP TWO" },
    { id: 3, iconUrl: "/image/Ocean/Boat_big.png", name: "SHIP THREE" },
  ];

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-screen flex justify-center items-center">
      {!shipsBagBackg && (
        <div className="w-full relative flex flex-col bg-[#343A40] p-12 gap-4">
          <div className="absolute top-0 right-4 text-6xl text-white cursor-pointer" onClick={closeShipsMenu}>
            ×
          </div>

          <div className="w-full flex justify-around items-center py-4">
            {shipsTopData.map((data) => (
              <div
                key={data.id}
                className="w-64 h-16 flex justify-center items-center text-white text-3xl cursor-pointer bg-btn-frame bg-center bg-no-repeat bg-cover"
              >
                {data.title}
              </div>
            ))}
          </div>

          {ships.map((ship) => (
            <div key={ship.id} className="w-full">
              <div className="w-full h-[125px] flex items-center bg-black gap-4">
                <div className="relative w-1/6 h-full">
                  <div className="absolute left-1 text-white text-xl">{ship.id}</div>
                  <Image
                    className="w-4/5 h-4/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    src="/image/Ocean/Boat_big.png"
                    alt="boat-big"
                    width={125}
                    height={100}
                    priority
                  />
                </div>

                <div className="flex-1 h-full text-white border-x-[1px] border-white p-4">
                  <p>Name: {ship.name}</p>
                  <p>ID: {ship.ID}</p>
                  <p>HP: {ship.HP}</p>
                </div>

                <div
                  className="w-1/5 h-full flex justify-center items-center text-white text-2xl cursor-pointer"
                  onClick={() => setShipsBagBackg(true)}
                >
                  TransFer Inventory
                </div>
              </div>
            </div>
          ))}

          <div className="w-full flex justify-end items-center gap-4">
            <div className="w-[90px] aspect-[1] text-center text-7xl text-white cursor-pointer bg-btn-frame bg-center bg-no-repeat bg-cover">
              +
            </div>

            <div className="w-[144px] h-[70px] flex justify-center items-center text-white text-3xl cursor-pointer bg-btn-frame bg-center bg-no-repeat bg-cover">
              SAIL
            </div>
          </div>
        </div>
      )}

      {shipsBagBackg && (
        <div className="flex justify-between items-center h-full w-[115%]">
          {shipInventories.map((inventory) => (
            <div key={inventory.id} className="flex flex-col items-center w-[26%] h-[80%] bg-[#343A40]">
              <div className="flex justify-evenly items-center w-full h-[15%]">
                <div className="w-[120px] h-[120px] bg-btn-frame bg-center bg-no-repeat bg-cover">
                  <Image
                    className="w-full h-full scale-[60%]"
                    src={inventory.iconUrl}
                    alt="inventory-pic"
                    width={120}
                    height={120}
                    priority
                  />
                </div>

                <div className="flex justify-center items-center bg-btn-frame bg-center bg-no-repeat bg-cover text-white text-center px-12 py-3">
                  {inventory.name}
                </div>

                {/* {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <div
                    key={num}
                    className="w-[180px] h-[56px] bg-btn-frame bg-center bg-no-repeat bg-cover text-white text-center"
                  >
                    {inventory.name}
                  </div>
                ))} */}
              </div>

              <div className="w-[85%] flex flex-col items-center bg-[#fffbe7] p-4 gap-4">
                <div className="text-xl text-white text-center bg-btn-frame bg-center bg-no-repeat bg-cover px-16 py-3">
                  SHIP INVENTORY
                </div>

                <div className="w-full grid grid-cols-3 gap-3">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <div key={num} className="w-full aspect-[1] bg-btn-frame bg-center bg-no-repeat bg-cover" />
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div
            className="w-[135px] h-[72px] absolute bottom-10 right-0 text-white flex justify-center items-center text-3xl cursor-pointer bg-btn-frame bg-center bg-no-repeat bg-cover"
            onClick={() => setShipsBagBackg(false)}
          >
            back
          </div>
        </div>
      )}
    </div>
  );
}
