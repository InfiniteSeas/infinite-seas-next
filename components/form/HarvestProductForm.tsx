"use client";

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
  productType,
  unassignedRosterId,
}: {
  productType: string;
  unassignedRosterId: string;
}) {
  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();

  const { currentPlayerId, skillProcesses, refetchPlayer } = useGlobalContext();

  async function harvestProductAction() {
    if (!currentPlayerId) return toast.error("Please login first!");

    let functionName = "";
    let skillProcessId = "";
    let itemFormulaId = "";

    // If the player harvests ore
    if (productType === "ore") {
      const miningProcess = skillProcesses.filter((process) => process.skillType === 3)[0];
      if (miningProcess.completed) return toast.error("No ore to havest, please start mining first!");

      functionName = "complete_creation";
      skillProcessId = miningProcess.id_;
      itemFormulaId = ITEM_CREATION_MINING;
    }

    // If the player harvests wood
    else if (productType === "wood") {
      const woodCuttingProcess = skillProcesses.filter((process) => process.skillType === 1)[0];
      if (woodCuttingProcess.completed) return toast.error("No wood to havest, please start wood cutting first!");

      functionName = "complete_creation";
      skillProcessId = woodCuttingProcess.id_;
      itemFormulaId = ITEM_CREATION_WOODING;
    }

    // If the player harvests cotton seeds from process 1
    else if (productType === "seed1") {
      const seedingProcess = skillProcesses.filter((process) => process.skillType === 0)[0];
      if (seedingProcess.completed) return toast.error("No cotton to harvest, please start seeding cotton first!");

      functionName = "complete_production";
      skillProcessId = seedingProcess.id_;
      itemFormulaId = ITEM_PRODUCTION_FARMING;
    }

    // If the player harvests cotton seeds from process 2
    else if (productType === "seed2") {
      const seedingProcess = skillProcesses.filter((process) => process.skillType === 0)[1];
      if (seedingProcess.completed) return toast.error("No cotton to harvest, please start seeding cotton first!");

      functionName = "complete_production";
      skillProcessId = seedingProcess.id_;
      itemFormulaId = ITEM_PRODUCTION_FARMING;
    }

    // If the player harvests craft
    else if (productType === "craft") {
      const craftingProcess = skillProcesses.filter((process) => process.skillType === 6)[0];
      if (craftingProcess.completed) return toast.error("No ship to havest, please start crafting first!");

      functionName = "complete_ship_production";
      skillProcessId = craftingProcess.id_;
      itemFormulaId = ITEM_PRODUCTION_CRAFTING;
    }

    try {
      toast.success("Harvesting creation, please approve with your wallet...");

      const txb = new TransactionBlock();

      txb.setGasBudget(42000000);

      txb.moveCall({
        target: `${MAIN_PACKAGE_ID}::skill_process_aggregate::${functionName}`,
        arguments:
          productType === "craft"
            ? [
                txb.object(skillProcessId),
                txb.object(unassignedRosterId),
                txb.object(currentPlayerId),
                txb.object(itemFormulaId),
                txb.object(EXPERIENCE_TABLE),
                txb.object("0x6"),
              ]
            : [
                txb.object(skillProcessId),
                txb.object(currentPlayerId),
                txb.object(itemFormulaId),
                txb.object(EXPERIENCE_TABLE),
                txb.object("0x6"),
              ],
      });

      const { digest } = await signAndExecuteTransactionBlockAsync({ transactionBlock: txb });
      toast.success("The transaction is sent to the block chain, please wait a sec for result...");

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
    <button
      className="text-xs border-[1px] border-white text-white rounded-md cursor-pointer px-1"
      type="button"
      onClick={harvestProductAction}
    >
      GET
    </button>
  );
}
