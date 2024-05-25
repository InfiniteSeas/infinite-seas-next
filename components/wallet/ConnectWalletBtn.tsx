"use client";

import Image from "next/image";
import { useConnectWallet, useWallets } from "@mysten/dapp-kit";

export default function WalletMenu() {
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();

  function handleConnect() {
    connect(
      { wallet: wallets[0] },
      {
        onSuccess: () => console.log("connected"),
      }
    );
  }

  return (
    <Image
      className="cursor-pointer"
      src="/image/home/Wallet_Button.png"
      alt="wallet-button"
      width={50}
      height={50}
      priority
      onClick={handleConnect}
    />
  );
}
