"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import StartCraftForm from "@/components/form/StartCraftForm";

export default function CraftMenu({
  copperLeft,
  logLeft,
  cottonLeft,
}: {
  copperLeft: number;
  logLeft: number;
  cottonLeft: number;
}) {
  const [shipCopper, setShipCopper] = useState<number>(3);
  const [shipLog, setShipLog] = useState<number>(3);
  const [shipCotton, setShipCotton] = useState<number>(3);

  const [attack, setAttack] = useState<number>(3);
  const [protection, setProtection] = useState<number>(3);
  const [speed, setSpeed] = useState<number>(3);

  const [inventoryCopper, setInventoryCopper] = useState<number>(copperLeft - 3);
  const [inventoryLog, setInventoryLog] = useState<number>(logLeft - 3);
  const [inventoryCotton, setInventoryCotton] = useState<number>(cottonLeft - 3);

  const [modalFlag, setModalFlag] = useState<boolean>(false);

  // Rerender ui related to the current player's info
  useEffect(() => {
    setShipCopper(3);
    setShipLog(3);
    setShipCotton(3);

    setAttack(3);
    setProtection(3);
    setSpeed(3);

    setInventoryCopper(copperLeft - 3);
    setInventoryLog(logLeft - 3);
    setInventoryCotton(cottonLeft - 3);
  }, [copperLeft, logLeft, cottonLeft]);

  const sidebarTitle = ["Small Ship", "Locked", "Locked", "Locked", "Locked", "Locked"];

  function addCooper() {
    if (inventoryCopper <= 0) return toast.error("Not enough copper in your inventory!");
    if (shipCopper + shipLog + shipCotton >= 15) return toast.error("You can add only 15 resources totally!");

    setShipCopper((prev) => ++prev);
    setAttack((prev) => ++prev);
    setInventoryCopper((prev) => --prev);
  }

  function addLog() {
    if (inventoryLog <= 0) return toast.error("Not enough log in your inventory!");
    if (shipCopper + shipLog + shipCotton >= 15) return toast.error("You can add only 15 resources totally!");

    setShipLog((prev) => ++prev);
    setProtection((prev) => ++prev);
    setInventoryLog((prev) => --prev);
  }

  function addCotton() {
    if (inventoryCotton <= 0) return toast.error("Not enough cotton in your inventory!");
    if (shipCopper + shipLog + shipCotton >= 15) return toast.error("You can add only 15 resources totally!");

    setShipCotton((prev) => ++prev);
    setSpeed((prev) => ++prev);
    setInventoryCotton((prev) => --prev);
  }

  function removeCopper() {
    if (shipCopper <= 3) return toast.error("You must add 3 copper at least!");

    setShipCopper((prev) => --prev);
    setAttack((prev) => --prev);
    setInventoryCopper((prev) => ++prev);
  }

  function removeLog() {
    if (shipLog <= 3) return toast.error("You must add 3 log at least!");

    setShipLog((prev) => --prev);
    setProtection((prev) => --prev);
    setInventoryLog((prev) => ++prev);
  }

  function removeCotton() {
    if (shipCotton <= 3) return toast.error("You must add 3 cotton at least!");

    setShipCotton((prev) => --prev);
    setSpeed((prev) => --prev);
    setInventoryCotton((prev) => ++prev);
  }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 z-40 flex items-center gap-2">
      <div className="flex flex-col items-center h-full bg-center bg-no-repeat bg-paper-col bg-[length:100%_100%] p-6 gap-3">
        {sidebarTitle.map((title, index) => (
          <div
            key={index}
            className="w-full flex justify-center items-center bg-center bg-no-repeat bg-frame-text bg-[length:100%_100%] px-8 py-4 gap-2"
          >
            {index !== 0 && (
              <Image src="/image/product-menu/Lock.png" alt="lock-icon" width={24} height={24} priority />
            )}
            <p className="text-lg text-white">{title}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 h-full flex flex-col items-center bg-center bg-no-repeat bg-paper-row bg-[length:100%_100%] gap-6 py-6 px-10">
        <div className="w-full flex justify-between items-center gap-2">
          <div className="w-[150px] h-[95%] bg-center bg-no-repeat bg-frame-normal bg-[length:100%_100%] flex justify-center items-center">
            <Image src="/image/ocean/Boat_small.png" alt="small-boat" width={60} height={100} priority />
          </div>

          <div className="flex-1 flex justify-between items-center bg-center bg-no-repeat bg-frame-width bg-[length:100%_100%] text-white px-10 py-6">
            <div className="flex flex-col gap-1">
              <p className="text-lg leading-none">Small Ship</p>
              <Image src="/image/craft/center_line.png" alt="center-line-icon" width={100} height={20} priority />
              <p className="text-lg leading-none mt-2">Require: 15 Resources</p>
              <p className="text-lg leading-none">Cost: 5 Energy</p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Image src="/image/craft/ATK_icon.png" alt="attack-icon" width={20} height={20} priority />
                <p>Attack: {attack}</p>
              </div>
              <div className="flex items-center gap-1">
                <Image src="/image/craft/DEF_icon.png" alt="defense-icon" width={20} height={20} priority />
                <p>Protection: {protection}</p>
              </div>
              <div className="flex items-center gap-1">
                <Image src="/image/craft/speed_icon.png" alt="speed-icon" width={20} height={20} priority />
                <p>Speed: {speed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-5 gap-3 text-xl text-white">
          <div
            className="w-full aspect-[7/6] relative flex justify-center items-center bg-center bg-no-repeat bg-frame-normal bg-[length:100%_100%] cursor-pointer"
            onClick={removeCopper}
          >
            <Image src="/image/product-menu/Mine_Unlocked.png" alt="copper-icon" width={60} height={60} priority />
            <span className="absolute bottom-2 right-5">{shipCopper}</span>
          </div>
          <div
            className="w-full aspect-[7/6] relative flex justify-center items-center bg-center bg-no-repeat bg-frame-normal bg-[length:100%_100%] cursor-pointer"
            onClick={removeLog}
          >
            <Image src="/image/product-menu/Tree_Unlocked.png" alt="tree-icon" width={45} height={45} priority />
            <span className="absolute bottom-2 right-5">{shipLog}</span>
          </div>
          <div
            className="w-full aspect-[7/6] relative flex justify-center items-center bg-center bg-no-repeat bg-frame-normal bg-[length:100%_100%] cursor-pointer"
            onClick={removeCotton}
          >
            <Image src="/image/product-menu/Cotton_Unlocked.png" alt="cotton-icon" width={60} height={60} priority />
            <span className="absolute bottom-2 right-5">{shipCotton}</span>
          </div>
          {[0, 1, 2, 3, 4, 5, 6].map((id) => (
            <div
              key={id}
              className="w-full aspect-[7/6] bg-center bg-no-repeat bg-frame-normal bg-[length:100%_100%] cursor-pointer"
            />
          ))}
        </div>

        <div className="w-full flex justify-end">
          <Image
            className="cursor-pointer"
            src="/image/craft/Craft.png"
            alt="craft-icon"
            width={160}
            height={60}
            priority
            onClick={() => setModalFlag(true)}
          />
        </div>

        {modalFlag && (
          <StartCraftForm
            shipCopper={shipCopper}
            shipLog={shipLog}
            shipCotton={shipCotton}
            inventoryCopper={inventoryCopper}
            inventoryLog={inventoryLog}
            inventoryCotton={inventoryCotton}
            handleCloseModal={() => setModalFlag(false)}
          />
        )}
      </div>

      <div className="w-1/5 h-full flex flex-col items-center bg-center bg-no-repeat bg-paper-col bg-[length:100%_100%] p-6 gap-2">
        <p className="w-full text-lg text-white text-center bg-center bg-no-repeat bg-frame-width bg-[length:100%_100%] py-4">
          Inventory
        </p>

        <div className="w-full grid grid-cols-2 gap-2">
          <div
            className="w-full aspect-[1] relative flex justify-center items-center bg-center bg-no-repeat bg-frame-normal bg-[length:100%_100%] border-2 border-transparent rounded-md text-white cursor-pointer"
            onClick={addCooper}
          >
            <Image src="/image/product-menu/Mine_Unlocked.png" alt="copper-icon" width={40} height={40} priority />
            <span className="absolute bottom-1 right-3">{inventoryCopper}</span>
          </div>

          <div
            className="w-full aspect-[1] relative flex justify-center items-center bg-center bg-no-repeat bg-frame-normal bg-[length:100%_100%] border-2 border-transparent rounded-md text-white cursor-pointer"
            onClick={addLog}
          >
            <Image src="/image/product-menu/Tree_Unlocked.png" alt="tree-icon" width={30} height={30} priority />
            <span className="absolute bottom-1 right-3">{inventoryLog}</span>
          </div>

          <div
            className="w-full aspect-[1] relative flex justify-center items-center bg-center bg-no-repeat bg-frame-normal bg-[length:100%_100%] border-2 border-transparent rounded-md text-white cursor-pointer"
            onClick={addCotton}
          >
            <Image src="/image/product-menu/Cotton_Unlocked.png" alt="cotton-icon" width={40} height={40} priority />
            <span className="absolute bottom-1 right-3">{inventoryCotton}</span>
          </div>

          {[0, 1, 2, 3, 4].map((id) => (
            <div
              key={id}
              className="w-full aspect-[1] bg-center bg-no-repeat bg-frame-normal bg-[length:100%_100%] border-2 border-transparent rounded-md text-white cursor-pointer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
