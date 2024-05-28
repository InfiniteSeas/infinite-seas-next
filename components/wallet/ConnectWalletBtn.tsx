"use client";

import Image from "next/image";
import { useConnectWallet, useSignAndExecuteTransactionBlock, useWallets } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import toast from "react-hot-toast";

import TxToast from "@/components/shared/TxToast";
import { getPlayerInfo } from "@/actions/player.action";
import { MAIN_PACKAGE_ID } from "@/constant";

export default function WalletMenu() {
  const wallets = useWallets();
  const { mutateAsync: connectAsync } = useConnectWallet();
  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();

  async function connectAndCreatePlayerAction() {
    try {
      const { accounts } = await connectAsync({ wallet: wallets[0] });

      // Before create a new, let's check if it already has
      const player = await getPlayerInfo({ owner: accounts[0].address });
      if (!!player) return toast.success("Wallet connected!");

      toast.success("Creating a new player object, please approve with your wallet...");

      const txb = new TransactionBlock();

      txb.setGasBudget(11000000);

      txb.moveCall({
        target: `${MAIN_PACKAGE_ID}::player_aggregate::create`,
        arguments: [txb.pure.string("Sunrise")],
      });

      const { digest } = await signAndExecuteTransactionBlockAsync({ transactionBlock: txb });
      toast.custom(<TxToast title="New player created successfully!" digest={digest} />);
    } catch (error: any) {
      toast.error(`Failed to create a new player: ${error.message}!`);
    }
  }

  return (
    <Image
      className="cursor-pointer"
      src="/image/home/Wallet_Button.png"
      alt="wallet-button"
      width={50}
      height={50}
      priority
      onClick={connectAndCreatePlayerAction}
    />
  );
}
