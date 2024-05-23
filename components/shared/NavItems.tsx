"use client";

import Image from "next/image";

export default function NavItems({
  getIslandClicked,
  getShipsClicked,
}: {
  getIslandClicked: () => void;
  getShipsClicked: () => void;
}) {
  function handleSettingButton() {
    console.log("Here is setting button");
  }

  function handleWalletButton() {
    console.log("Here is wallet button");
  }

  function handlePointsButton() {
    console.log("Here is points button");
  }

  function handleEnergyBar() {
    console.log("Here is energy bar");
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      {/* Top-left buttons */}
      <Image
        className="absolute top-2 left-2 cursor-pointer"
        src="/image/home/Setting_Button.png"
        alt="setting-button"
        width={50}
        height={50}
        priority
        onClick={handleSettingButton}
      />
      <Image
        className="absolute top-4 left-2 cursor-pointer"
        src="/image/home/Wallet_Button.png"
        alt="wallet-button"
        width={50}
        height={50}
        priority
        onClick={handleWalletButton}
      />
      <Image
        className="absolute top-6 left-2 cursor-pointer"
        src="/image/home/Points-Button.png"
        alt="points-button"
        width={50}
        height={50}
        priority
        onClick={handlePointsButton}
      />

      {/* Energy bar */}
      <Image
        className="absolute top-2 right-2 cursor-pointer"
        src="/image/home/Energy_Bar.png"
        alt="energy-bar"
        width={220}
        height={120}
        priority
        onClick={handleEnergyBar}
      />

      {/* Bottom-right buttons */}
      <Image
        className="absolute bottom-0 right-6 cursor-pointer"
        src="/image/home/Island_Button.png"
        alt="island-button"
        width={110}
        height={160}
        priority
        onClick={getIslandClicked}
      />
      <Image
        className="absolute bottom-0 right-3 cursor-pointer"
        src="/image/home/Ships_Button.png"
        alt="ship-button"
        width={110}
        height={160}
        priority
        onClick={getShipsClicked}
      />
    </div>
  );
}
