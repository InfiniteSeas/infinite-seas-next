"use client";

import { useState } from "react";
import Image from "next/image";
import { useConnectWallet, useSignAndExecuteTransactionBlock, useWallets } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import toast from "react-hot-toast";

import AppModal from "@/components/ui/AppModal";
import AppInput from "@/components/ui/AppInput";
import TxToast from "@/components/shared/TxToast";

import { getPlayerId } from "@/actions/player.action";
import { revalidateGame, waitForReceipt } from "@/actions/system.action";

import { MAIN_PACKAGE_ID } from "@/constant";

export default function WalletMenu() {
  const [username, setUsername] = useState<string>("");
  const [modalFlag, setModalFlag] = useState<boolean>(false);

  const wallets = useWallets();
  const { mutateAsync: connectAsync } = useConnectWallet();
  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();

  async function connectAction() {
    try {
      const { accounts } = await connectAsync({ wallet: wallets[0] });

      const playerId = await getPlayerId({ owner: accounts[0].address });

      if (playerId) return toast.success("Wallet connected!");
      else setModalFlag(true);
    } catch (error: any) {
      toast.error(`Failed to connect player: ${error.message}!`);
    }
  }

  async function createAction() {
    try {
      toast.success("Creating a new player, please approve with your wallet...");

      const txb = new TransactionBlock();

      txb.setGasBudget(11000000);

      txb.moveCall({
        target: `${MAIN_PACKAGE_ID}::player_aggregate::create`,
        arguments: [txb.pure.string(username)],
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
    <>
      {modalFlag && (
        <AppModal>
          <AppInput label="Enter new username" value={username} handleChange={(value) => setUsername(value)} />

          <div className="flex w-4/5 justify-evenly items-center">
            <div
              className="hover:bg-[#e9e9e9] border-[1px] border-black rounded-md px-2 cursor-pointer"
              onClick={createAction}
            >
              Create
            </div>

            <div
              className="hover:bg-[#e9e9e9] border-[1px] border-black rounded-md px-2 cursor-pointer"
              onClick={() => setModalFlag(false)}
            >
              Cancel
            </div>
          </div>
        </AppModal>
      )}

      <Image
        className="cursor-pointer"
        src="/image/home/wallet.png"
        alt="wallet-button"
        width={50}
        height={50}
        priority
        onClick={connectAction}
      />
    </>
  );
}
