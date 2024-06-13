"use client";

import Image from "next/image";
import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient } from "@mysten/dapp-kit";
import { useEnokiFlow } from "@mysten/enoki/react";
import toast from "react-hot-toast";

import AppModal from "@/components/ui/AppModal";
import TxToast from "@/components/shared/TxToast";

import { waitForReceipt } from "@/actions/system.action";
import { useGlobalContext } from "@/context/GlobalContext";
import { MAIN_PACKAGE_ID, MAP, ROSTER_TABLE, SKILL_PROCESS_TABLE } from "@/constant";

export default function ClaimIslandForm({
  coordinateX,
  coordinateY,
  handleCloseModal,
}: {
  coordinateX: number;
  coordinateY: number;
  handleCloseModal: () => void;
}) {
  const { currentPlayerId, refetchPlayer } = useGlobalContext();

  const client = useSuiClient();
  const enokiFlow = useEnokiFlow();

  async function claimIslandAction() {
    if (!currentPlayerId) return toast.error("Please login first!");

    toast.loading("Claiming the island, it may take a while...");

    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${MAIN_PACKAGE_ID}::player_aggregate::claim_island`,
        arguments: [
          tx.object(currentPlayerId),
          tx.object(MAP),
          tx.pure.u32(coordinateX),
          tx.pure.u32(coordinateY),
          tx.object("0x6"),
          tx.object(ROSTER_TABLE),
          tx.object(SKILL_PROCESS_TABLE),
        ],
      });

      const { digest } = await client.signAndExecuteTransaction({
        signer: await enokiFlow.getKeypair({ network: "testnet" }),
        transaction: tx,
      });
      toast.loading("The transaction is sent to the blockchain, checking the result...");

      const { status, error } = await waitForReceipt({ digest });

      if (status === "success") {
        await refetchPlayer();
        toast.custom(<TxToast title="Island claimed successfully!" digest={digest} />);
      } else toast.error(`Failed to claim island: ${error}`);
    } catch (error: any) {
      toast.error(`Failed to claim island: ${error.message}!`);
    }
  }

  return (
    <AppModal frame="bg-frame-claim">
      <div className="relative flex flex-col justify-between items-center text-2xl text-white px-12 pt-6 pb-[74px] gap-4">
        <p>Are you sure to</p>
        <p>claim this island?</p>
        <p>
          X: {coordinateX}, Y: {coordinateY}
        </p>

        <div className="absolute -bottom-0.5 w-full text-center cursor-pointer" onClick={claimIslandAction}>
          Claim
        </div>

        <Image
          className="absolute top-0 right-2 cursor-pointer"
          src="/image/modal/x-mark.png"
          alt="x-icon"
          width={30}
          height={30}
          priority
          onClick={handleCloseModal}
        />
      </div>
    </AppModal>
  );
}
