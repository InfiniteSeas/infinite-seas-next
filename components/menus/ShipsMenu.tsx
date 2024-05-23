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
    <div className="fixed top-0 left-0 w-2/3 h-screen flex flex-col justify-between ml-[15%] mr-[20%]">
      <div className="w-full h-4/5 flex border-[1px] border-white">
        <div className="w-full h-full border-[1px] border-red-400">
          <div className="w-full h-[10%] flex justify-around items-center border-[1px] border-black">
            {shipsTopData.map((data) => (
              <div
                key={data.id}
                className="h-full flex items-center bg-contain text-white text-3xl cursor-pointer bg-[url('/image/btn/btn_frame.png')]"
              >
                {data.title}
              </div>
            ))}
          </div>

          {ships.map((ship) => (
            <div key={ship.id} className="w-full">
              <div className="w-full h-[125px] flex items-center bg-black">
                <div className="relative w-1/5 h-full border-[1px] border-white">
                  <div className="absolute left-1 text-white text-xl">{ship.id}</div>
                  <Image
                    className="w-[70%] h-4/5 absolute top-1/2 left-1/2 -transport-x-1/2 -transport-y-1/2"
                    src="/image/Ocean/Boat_big.png"
                    alt="boat-big"
                    width={125}
                    height={100}
                    priority
                  />
                </div>

                <div className="w-4/5 h-full text-white ml-2">
                  <p>Name: {ship.name}</p>
                  <p>ID: {ship.ID}</p>
                  <p>HP: {ship.HP}</p>
                </div>

                <div
                  className="w-1/5 h-full flex justify-center items-center text-white text-2xl border-[1px] border-white cursor-pointer"
                  onClick={() => setShipsBagBackg(true)}
                >
                  TransFer Inventory
                </div>
              </div>
            </div>
          ))}

          <div className="w-full h-[10%] flex justify-center items-center border-[1px] border-white">
            <div className="w-[90px] h-[100px] text-4xl text-center text-white cursor-pointer bg-cotain bg-[url('/image/btn/btn_frame.png')]">
              +
            </div>
          </div>

          <div className="absolute top-6 right-0 text-3xl cursor-pointer" onClick={closeShipsMenu}>
            ×
          </div>

          <div className="absolute right-6 w-[144px] h-[77px] text-center text-white text-3xl bg-[url('/image/btn/btn_frame.png')]">
            SAIL
          </div>
        </div>
      </div>

      {shipsBagBackg && (
        <div className="flex justify-between items-center border-[1px] border-white h-full w-[115%]">
          {shipInventories.map((inventory) => (
            <div key={inventory.id} className="flex flex-col items-center w-[26%] h-[80%] border-[1px] border-black">
              <div className="flex justify-evenly items-center border-[1px] border-white w-full h-[15%]">
                <div className="w-[90px] h-[99px] bg-[url('/image/btn/btn_frame.png')] bg-contain">
                  <Image className="w-full h-full scale-[60%]" src={inventory.iconUrl} alt="inventory-pic" />
                </div>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <div
                    key={num}
                    className="w-[180px] h-[56px] bg-[url('/image/btn/btn_frame.png')] bg-contain text-white text-center"
                  >
                    {inventory.name}
                  </div>
                ))}
              </div>

              <div className="w-[85%] flex flex-col items-center bg-[#fffbe7] px-4 py-3">
                <div className="w-[270px] h-[72px] text-2xl text-white text-center bg-[url('/image/btn/btn_frame.png')]">
                  SHIP INVENTORY
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="w-[90px] h-[99px] bg-[url('/image/btn/btn_frame.png')] bg-contain" />
                </div>
              </div>
            </div>
          ))}

          <div
            className="w-[135px] h-[72px] absolute bottom-1 right-5 text-white text-center text-3xl cursor-pointer bg-[url('/image/btn/btn_frame.png')] bg-contain"
            onClick={() => setShipsBagBackg(false)}
          >
            back
          </div>
        </div>
      )}
    </div>
  );
}
