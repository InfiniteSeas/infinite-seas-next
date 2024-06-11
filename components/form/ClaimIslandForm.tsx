"use client";

import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
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
  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransaction();

  const { currentPlayerId, refetchPlayer } = useGlobalContext();

  async function claimIslandAction() {
    if (!currentPlayerId) return toast.error("Please login first!");

    toast.loading("Claiming the island, please approve with your wallet...");

    try {
      const tx = new Transaction();

      tx.setGasBudget(4999000000);

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

      const { digest } = await signAndExecuteTransactionBlockAsync({ transaction: tx });
      toast.loading("The transaction is sent to the blockchain, please wait a sec for result...");

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
