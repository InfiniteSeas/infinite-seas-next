"use client";

import Image from "next/image";
import { useConnectWallet, useSignAndExecuteTransactionBlock, useWallets } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import toast from "react-hot-toast";

import TxToast from "@/components/shared/TxToast";

import { getPlayerId } from "@/actions/player.action";
import { revalidateGame, waitForReceipt } from "@/actions/system.action";

import { MAIN_PACKAGE_ID } from "@/constant";

export default function WalletMenu() {
  const wallets = useWallets();
  const { mutateAsync: connectAsync } = useConnectWallet();
  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();

  async function connectAndCreatePlayerAction() {
    try {
      const { accounts } = await connectAsync({ wallet: wallets[0] });

      // Before create a new, let's check if it already has
      const playerId = await getPlayerId({ owner: accounts[0].address });
      if (playerId) return toast.success("Wallet connected!");

      toast.success("Creating a new player, please approve with your wallet...");

      const txb = new TransactionBlock();

      txb.setGasBudget(11000000);

      txb.moveCall({
        target: `${MAIN_PACKAGE_ID}::player_aggregate::create`,
        arguments: [txb.pure.string("Sunrise")],
      });

      const { digest } = await signAndExecuteTransactionBlockAsync({ transactionBlock: txb });
      toast.success("The transaction is sent to the block chain, please wait a sec for result...");

      const receipt = await waitForReceipt({ digest });

      if (receipt.effects?.status.status === "success")
        toast.custom(<TxToast title="New player created and connected successfully!" digest={digest} />);
      else toast.error(`Failed to create new player: ${receipt.effects?.status.error}`);

      revalidateGame();
    } catch (error: any) {
      toast.error(`Failed to create new player: ${error.message}!`);
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
