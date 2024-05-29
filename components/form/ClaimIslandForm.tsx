"use client";

import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import toast from "react-hot-toast";

import TxToast from "@/components/shared/TxToast";

import { revalidateGame } from "@/actions/system.action";
import { getPlayerId } from "@/actions/player.action";

import { MAIN_PACKAGE_ID, MAP, ROSTER_TABLE, SKILL_PROCESS_TABLE } from "@/constant";

export default function ClaimIslandForm({ coordinateX, coordinateY }: { coordinateX: number; coordinateY: number }) {
  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();
  const currentAccount = useCurrentAccount();

  async function claimIslandAction() {
    if (!currentAccount) return toast.error("Please login first!");
    const playerId = await getPlayerId({ owner: currentAccount.address });

    toast.success("Claiming the island, please approve with your wallet...");

    try {
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
      toast.custom(<TxToast title="Island claimed successfully!" digest={digest} />);

      revalidateGame();
    } catch (error: any) {
      toast.error(`Failed to claim island: ${error.message}!`);
    }
  }

  return (
    <button className="text-white" onClick={claimIslandAction}>
      Claim this island
    </button>
  );
}
