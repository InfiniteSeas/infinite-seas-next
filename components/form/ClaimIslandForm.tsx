"use client";

import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import toast from "react-hot-toast";

import TxToast from "@/components/shared/TxToast";
import { MAIN_PACKAGE_ID, MAP_ID, ROSTER_TABLE_ID, SKILL_PROCESS_TABLE_ID } from "@/constant";

export default function ClaimIslandForm() {
  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();

  async function claimIslandAction() {
    toast.success("Claiming the island, please sign by your wallet...");

    try {
      const txb = new TransactionBlock();

      txb.setGasBudget(4999000000);

      txb.moveCall({
        target: `${MAIN_PACKAGE_ID}::player_aggregate::claim_island`,
        arguments: [
          txb.object("0xe031a5d2793e9aed44cf9f9f4789d7a00194f42184cb77483a10819ba193d8d6"), // TODO: need to change
          txb.object(MAP_ID),
          txb.pure.u32(100), // Location coordinate x
          txb.pure.u32(150), // Location coordinate y
          txb.object("0x6"),
          txb.object(ROSTER_TABLE_ID),
          txb.object(SKILL_PROCESS_TABLE_ID),
        ],
      });

      const { digest } = await signAndExecuteTransactionBlockAsync({ transactionBlock: txb });
      toast.custom(<TxToast title="Island claimed successfully!" digest={digest} />);
    } catch (error: any) {
      toast.error(`Failed to claim island: ${error.message}!`);
    }
  }

  return (
    <button className="text-white" onClick={claimIslandAction}>
      Claim Button
    </button>
  );
}
