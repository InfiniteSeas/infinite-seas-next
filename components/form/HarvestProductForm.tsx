"use client";

import React, { useEffect, useState } from "react";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import toast from "react-hot-toast";

import TxToast from "@/components/shared/TxToast";
import { waitForReceipt } from "@/actions/system.action";
import {
  EXPERIENCE_TABLE,
  ITEM_CREATION_MINING,
  ITEM_CREATION_WOODING,
  ITEM_PRODUCTION_CRAFTING,
  ITEM_PRODUCTION_FARMING,
  MAIN_PACKAGE_ID,
} from "@/constant";
import { useGlobalContext } from "@/context/GlobalContext";

export default function HarvestProductForm({
  processId,
  skillType,
  processCompleted,
  initialCount,
  startedAt,
  unassignedRosterId,
}: {
  processId: string;
  skillType: number;
  processCompleted: boolean;
  initialCount: number;
  startedAt: string;
  unassignedRosterId: string;
}) {
  const [count, setCount] = useState<number>(initialCount);

  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();

  const { currentPlayerId, refetchPlayer } = useGlobalContext();

  useEffect(() => {
    setCount(initialCount);

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialCount, startedAt]);

  async function harvestProductAction() {
    if (!currentPlayerId) return toast.error("Please login first!");

    let functionName = "";
    let itemFormulaId = "";

    // If the player harvests cotton seeds
    if (skillType === 0) {
      if (processCompleted) return toast.error("No cotton to harvest, please start seeding cotton first!");

      functionName = "complete_production";
      itemFormulaId = ITEM_PRODUCTION_FARMING;
    }

    // If the player harvests wood
    else if (skillType === 1) {
      if (processCompleted) return toast.error("No wood to harvest, please start wood cutting first!");

      functionName = "complete_creation";
      itemFormulaId = ITEM_CREATION_WOODING;
    }

    // If the player harvests ore
    else if (skillType === 3) {
      if (processCompleted) return toast.error("No ore to harvest, please start mining first!");

      functionName = "complete_creation";
      itemFormulaId = ITEM_CREATION_MINING;
    }

    // If the player harvests craft
    else if (skillType === 6) {
      if (processCompleted) return toast.error("No ship to harvest, please start crafting first!");

      functionName = "complete_ship_production";
      itemFormulaId = ITEM_PRODUCTION_CRAFTING;
    }

    try {
      toast.loading("Harvesting creation, please approve with your wallet...");

      const txb = new TransactionBlock();

      txb.setGasBudget(42000000);

      txb.moveCall({
        target: `${MAIN_PACKAGE_ID}::skill_process_aggregate::${functionName}`,
        arguments:
          skillType === 6
            ? [
                txb.object(processId),
                txb.object(unassignedRosterId),
                txb.object(currentPlayerId),
                txb.object(itemFormulaId),
                txb.object(EXPERIENCE_TABLE),
                txb.object("0x6"),
              ]
            : [
                txb.object(processId),
                txb.object(currentPlayerId),
                txb.object(itemFormulaId),
                txb.object(EXPERIENCE_TABLE),
                txb.object("0x6"),
              ],
      });

      const { digest } = await signAndExecuteTransactionBlockAsync({ transactionBlock: txb });
      toast.loading("The transaction is sent to the blockchain, please wait a sec for result...");

      const receipt = await waitForReceipt({ digest });

      if (receipt.effects?.status.status === "success") {
        await refetchPlayer();
        toast.custom(<TxToast title="Creation Harvested successfully!" digest={digest} />);
      } else toast.error(`Failed to harvest creation: ${receipt.effects?.status.error}`);
    } catch (error: any) {
      toast.error(`Failed to harvest creation: ${error.message}!`);
    }
  }

  return (
    <>
      <span className="text-white">{count}s</span>

      <button
        className="text-xs border-[1px] border-white text-white disabled:border-zinc-400 disabled:text-zinc-400 rounded-sm cursor-pointer px-1"
        type="button"
        disabled={processCompleted || count > 0}
        onClick={harvestProductAction}
      >
        GET
      </button>
    </>
  );
}
