"use client";

import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import toast from "react-hot-toast";

import TxToast from "@/components/shared/TxToast";
import {
  EXPERIENCE_TABLE,
  ITEM_CREATION_MINING,
  ITEM_CREATION_WOODING,
  ITEM_PRODUCTION_FARMING,
  MAIN_PACKAGE_ID,
} from "@/constant";
import { revalidateGame } from "@/actions/system.action";

export default function HarvestProductForm({
  productType,
  skillProcesses,
}: {
  productType: string;
  skillProcesses: any[];
}) {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();

  async function harvestProductAction() {
    if (!currentAccount) return toast.error("Please login first!");

    let functionName = "";
    let skillProcessId = "";
    let itemFormulaId = "";

    // If the player harvest ore
    if (productType === "ore") {
      const miningProcess = skillProcesses.filter((process) => process.skillProcessId.skillType === 3)[0];
      if (miningProcess.completed) return toast.error("No ore to havest, please start mining first!");

      functionName = "complete_creation";
      skillProcessId = miningProcess.id_;
      itemFormulaId = ITEM_CREATION_MINING;
    }

    // If the player does harvest wood
    else if (productType === "wood") {
      const woodCuttingProcess = skillProcesses.filter((process) => process.skillProcessId.skillType === 1)[0];
      if (woodCuttingProcess.completed) return toast.error("No wood to havest, please start wood cutting first!");

      functionName = "complete_creation";
      skillProcessId = woodCuttingProcess.id_;
      itemFormulaId = ITEM_CREATION_WOODING;
    }

    // If the player harvest cotton seeds from process 1
    else if (productType === "seed1") {
      const seedingProcess = skillProcesses.filter((process) => process.skillProcessId.skillType === 0)[0];
      if (seedingProcess.completed) return toast.error("No cotton to harvest, please start seeding cotton first!");

      functionName = "complete_production";
      skillProcessId = seedingProcess.id_;
      itemFormulaId = ITEM_PRODUCTION_FARMING;
    }

    // If the player harvest cotton seeds from process 2
    else if (productType === "seed2") {
      const seedingProcess = skillProcesses.filter((process) => process.skillProcessId.skillType === 0)[1];
      if (seedingProcess.completed) return toast.error("No cotton to harvest, please start seeding cotton first!");

      functionName = "complete_production";
      skillProcessId = seedingProcess.id_;
      itemFormulaId = ITEM_PRODUCTION_FARMING;
    }

    toast.success("Harvesting creation, please approve with your wallet...");

    try {
      const txb = new TransactionBlock();

      txb.setGasBudget(42000000);

      txb.moveCall({
        target: `${MAIN_PACKAGE_ID}::skill_process_aggregate::${functionName}`,
        arguments: [
          txb.object(skillProcessId),
          txb.object("0xe031a5d2793e9aed44cf9f9f4789d7a00194f42184cb77483a10819ba193d8d6"), // TODO: need to change
          txb.object(itemFormulaId),
          txb.object(EXPERIENCE_TABLE),
          txb.object("0x6"),
        ],
      });

      const { digest } = await signAndExecuteTransactionBlockAsync({ transactionBlock: txb });
      toast.custom(<TxToast title="Creation harvested successfully!" digest={digest} />);

      revalidateGame();
    } catch (error: any) {
      toast.error(`Failed to harvest creation: ${error.message}!`);
    }
  }

  return (
    <div className="text-sm border-[1px] rounded-md cursor-pointer" onClick={harvestProductAction}>
      Harvest
    </div>
  );
}
