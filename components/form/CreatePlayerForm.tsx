"use client";

import { useState } from "react";
import Image from "next/image";
import { useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useEnokiFlow } from "@mysten/enoki/react";
import toast from "react-hot-toast";

import AppModal from "@/components/ui/AppModal";
import AppInput from "@/components/ui/AppInput";
import TxToast from "@/components/shared/TxToast";

import { waitForReceipt } from "@/actions/system.action";
import { useGlobalContext } from "@/context/GlobalContext";
import { MAIN_PACKAGE_ID } from "@/constant";

export default function CreatePlayerForm({ handleCloseModal }: { handleCloseModal: () => void }) {
  const [username, setUsername] = useState<string>("");

  const client = useSuiClient();

  const enokiFlow = useEnokiFlow();

  const { currentUserAddress, refetchPlayer, refetchEnergy } = useGlobalContext();

  async function createAction() {
    toast.loading("Creating a new player...");

    try {
      const tx = new Transaction();

      tx.setSender(currentUserAddress);

      tx.setGasBudget(11000000);

      tx.moveCall({
        target: `${MAIN_PACKAGE_ID}::player_aggregate::create`,
        arguments: [tx.pure.string(username)],
      });

      const { digest } = await client.signAndExecuteTransaction({
        signer: await enokiFlow.getKeypair(),
        transaction: tx,
      });
      toast.loading("The transaction is sent to the blockchain, please wait a sec for result...");

      const { status, error } = await waitForReceipt({ digest });

      if (status === "success") {
        await refetchPlayer();
        await refetchEnergy();

        handleCloseModal();
        toast.custom(<TxToast title="New player created and connected successfully!" digest={digest} />);
      } else toast.error(`Failed to create new player: ${error}`);
    } catch (error: any) {
      toast.error(`Failed to create new player: ${error.message}!`);
    }
  }

  return (
    <AppModal frame="bg-frame-player">
      <div className="flex flex-col items-center text-2xl text-white px-8 py-4 gap-6">
        <div className="flex flex-col items-center gap-1">
          <h1>Create Your Player Name</h1>
          <Image src="/image/new-player/player-bar.png" alt="player-bar" width={300} height={10} priority />
        </div>

        <div className="flex items-center gap-1">
          <label htmlFor="newPlayerName">Name: </label>
          <input
            id="newPlayerName"
            className="w-32 bg-transparent border-b-[1px] border-white outline-none"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex items-center cursor-pointer gap-3" onClick={createAction}>
          <Image src="/image/new-player/left-confirm.png" alt="left-confirm" width={20} height={10} priority />
          <span>Confirm</span>
          <Image src="/image/new-player/right-confirm.png" alt="right-confirm" width={20} height={10} priority />
        </div>
      </div>
    </AppModal>
  );
}
