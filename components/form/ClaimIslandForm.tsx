"use client";

import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import toast from "react-hot-toast";

import AppModal from "@/components/ui/AppModal";
import TxToast from "@/components/shared/TxToast";

import { revalidateGame, waitForReceipt } from "@/actions/system.action";
import { getPlayerId } from "@/actions/player.action";

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
  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();
  const currentAccount = useCurrentAccount();

  async function claimIslandAction() {
    if (!currentAccount) return toast.error("Please login first!");

    toast.success("Claiming the island, please approve with your wallet...");

    try {
      const playerId = await getPlayerId({ owner: currentAccount.address });

      const txb = new TransactionBlock();

      txb.setGasBudget(4999000000);

      txb.moveCall({
        target: `${MAIN_PACKAGE_ID}::player_aggregate::claim_island`,
        arguments: [
          txb.object(playerId),
          txb.object(MAP),
          txb.pure.u32(coordinateX),
          txb.pure.u32(coordinateY),
          txb.object("0x6"),
          txb.object(ROSTER_TABLE),
          txb.object(SKILL_PROCESS_TABLE),
        ],
      });

      const { digest } = await signAndExecuteTransactionBlockAsync({ transactionBlock: txb });
      toast.success("The transaction is sent to the block chain, please wait a sec for result...");

      const receipt = await waitForReceipt({ digest });

      if (receipt.effects?.status.status === "success")
        toast.custom(<TxToast title="Island claimed successfully!" digest={digest} />);
      else toast.error(`Failed to claim island: ${receipt.effects?.status.error}`);

      revalidateGame();
    } catch (error: any) {
      toast.error(`Failed to claim island: ${error.message}!`);
    }
  }

  return (
    <AppModal>
      <p>Are you sure to</p>
      <p>claim this island?</p>
      <p>
        X: {coordinateX}, Y: {coordinateY}
      </p>

      <div className="w-4/5 flex justify-evenly items-center">
        <div className="hover:bg-[#e9e9e9] border-[1px] rounded-md cursor-pointer p-1" onClick={claimIslandAction}>
          Claim
        </div>
        <div className="hover:bg-[#e9e9e9] border-[1px] rounded-md cursor-pointer p-1" onClick={handleCloseModal}>
          Cancel
        </div>
      </div>
    </AppModal>
  );
}
