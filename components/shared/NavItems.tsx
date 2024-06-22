"use client";

import Image from "next/image";

import ConnectWalletForm from "@/components/form/ConnectWalletForm";
import EnergyFaucetForm from "@/components/form/EnergyFaucetForm";

import { useGlobalContext } from "@/context/GlobalContext";

export default function NavItems({
  getIslandClicked,
  getShipsClicked,
}: {
  getIslandClicked: () => void;
  getShipsClicked: () => void;
}) {
  const { energyBalance } = useGlobalContext();

  function handleSettingButton() {
    console.log("Here is setting button");
  }

  function handlePointsButton() {
    console.log("Here is points button");
  }

  function handleEnergyBar() {
    console.log("Here is energy bar");
  }

  return (
    <>
      {/* Top-left buttons */}
      <div className="fixed top-6 left-6 flex flex-col gap-3">
        <Image
          className="cursor-pointer"
          src="/image/home/settings.png"
          alt="setting-button"
          width={50}
          height={50}
          priority
          onClick={handleSettingButton}
        />
        <ConnectWalletForm />
        <Image
          className="cursor-pointer"
          src="/image/home/points.png"
          alt="points"
          width={50}
          height={50}
          priority
          onClick={handlePointsButton}
        />
      </div>

      {/* Energy bar */}
      <div className="fixed top-4 right-4 cursor-pointer">
        <Image
          src="/image/home/energy-bar.png"
          alt="energy-bar"
          width={240}
          height={120}
          priority
          onClick={handleEnergyBar}
        />
        <p className="absolute left-[95px] w-[52px] bottom-[23px] text-white text-center text-lg">{energyBalance}</p>
      </div>

      {/* Faucet */}
      <EnergyFaucetForm />

      {/* Bottom-right cards */}
      <div className="flex items-center fixed bottom-2 right-6 gap-1">
        <Image
          className="cursor-pointer"
          src="/image/home/island-card.png"
          alt="island-card"
          width={110}
          height={160}
          priority
          onClick={getIslandClicked}
        />
        <Image
          className="cursor-pointer"
          src="/image/home/ships-card.png"
          alt="ship-card"
          width={110}
          height={160}
          priority
          onClick={getShipsClicked}
        />
      </div>
    </>
  );
}
