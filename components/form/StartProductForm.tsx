"use client";

import { useState } from "react";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import toast from "react-hot-toast";

import AppModal from "@/components/ui/AppModal";
import AppInput from "@/components/ui/AppInput";
import TxToast from "@/components/shared/TxToast";

import { waitForReceipt } from "@/actions/system.action";
import { useGlobalContext } from "@/context/GlobalContext";
import { ITEM_CREATION_MINING, ITEM_CREATION_WOODING, ITEM_PRODUCTION_FARMING, MAIN_PACKAGE_ID } from "@/constant";

export default function StartProductForm({
  productType,
  oreLeft,
  woodLeft,
  seedsLeft,
  handleCloseModal,
}: {
  productType: string;
  oreLeft: number;
  woodLeft: number;
  seedsLeft: number;
  handleCloseModal: () => void;
}) {
  const [batchSize, setBatchSize] = useState<string>("0");

  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();

  const { currentPlayerId, skillProcesses, energyObjectId, energyBalance, setRefetchPlayerFlag, setRefetchEnergyFlag } =
    useGlobalContext();

  async function startProductAction() {
    if (!currentPlayerId) return toast.error("Please login first!");

    let functionName = "";
    let skillProcessId = "";
    let itemFormulaId = "";

    // If the player does mining
    if (productType === "ore") {
      if (Number(batchSize) > oreLeft) return toast.error("Not enough ore left!");
      if (Number(batchSize) > energyBalance)
        return toast.error("You don't have enough energy coin, please buy some first!");

      const miningProcess = skillProcesses.filter((process) => process.skillType === 3)[0];
      if (!miningProcess.completed)
        return toast.error("Please wait for the end of the mining process and harvest first!");

      functionName = "start_creation";
      skillProcessId = miningProcess.id_;
      itemFormulaId = ITEM_CREATION_MINING;
    }

    // If the player does wood cutting
    else if (productType === "wood") {
      if (Number(batchSize) > woodLeft) return toast.error("Not enough wood left!");
      if (Number(batchSize) > energyBalance)
        return toast.error("You don't have enough energy coin, please buy some first!");

      const woodCuttingProcess = skillProcesses.filter((process) => process.skillType === 1)[0];
      if (!woodCuttingProcess.completed)
        return toast.error("Please wait for the end of the wood cutting process and harvest first!");

      functionName = "start_creation";
      skillProcessId = woodCuttingProcess.id_;
      itemFormulaId = ITEM_CREATION_WOODING;
    }

    // If the player does seed farming
    else if (productType === "seed") {
      if (Number(batchSize) > seedsLeft) return toast.error("Not enough cotton seed left!");
      if (Number(batchSize) * 5 > energyBalance)
        return toast.error("You don't have enough energy coin, please buy some first!");

      const seedingProcesses: any[2] = skillProcesses.filter((process) => process.skillType === 0);
      if (seedingProcesses[0].completed) skillProcessId = seedingProcesses[0].id_;
      else if (seedingProcesses[1].completed) skillProcessId = seedingProcesses[1].id_;
      else return toast.error("Please wait for the end of the seeding process and harvest first!");

      functionName = "start_production";
      itemFormulaId = ITEM_PRODUCTION_FARMING;
    }

    try {
      toast.success("Starting creation, please approve with your wallet...");

      const txb = new TransactionBlock();

      txb.setGasBudget(11000000);

      txb.moveCall({
        target: `${MAIN_PACKAGE_ID}::skill_process_service::${functionName}`,
        arguments: [
          txb.object(skillProcessId),
          txb.pure.u32(Number(batchSize)),
          txb.object(currentPlayerId),
          txb.object(itemFormulaId),
          txb.object("0x6"),
          txb.object(energyObjectId),
        ],
      });

      const { digest } = await signAndExecuteTransactionBlockAsync({ transactionBlock: txb });
      toast.success("The transaction is sent to the block chain, please wait a sec for result...");

      const receipt = await waitForReceipt({ digest });

      setRefetchPlayerFlag((prev) => !prev);
      setRefetchEnergyFlag((prev) => !prev);

      if (receipt.effects?.status.status === "success")
        toast.custom(<TxToast title="Creation started successfully!" digest={digest} />);
      else toast.error(`Failed to start creation: ${receipt.effects?.status.error}`);
    } catch (error: any) {
      toast.error(`Failed to start creation: ${error.message}!`);
    }
  }

  return (
    <AppModal>
      <AppInput label={productType} value={batchSize} handleChange={(value) => setBatchSize(value)} />

      <p>costs {["ore", "wood"].includes(productType) ? batchSize : Number(batchSize) * 5} energy token</p>

      <p>
        {["ore", "wood"].includes(productType) ? Number(batchSize) * 3 : Number(batchSize) * 15} seconds time duration
      </p>

      <div className="flex w-4/5 justify-evenly items-center">
        <div
          className="hover:bg-[#e9e9e9] border-[1px] border-black rounded-md px-2 cursor-pointer"
          onClick={startProductAction}
        >
          Create
        </div>

        <div
          className="hover:bg-[#e9e9e9] border-[1px] border-black rounded-md px-2 cursor-pointer"
          onClick={() => {
            handleCloseModal();
            setBatchSize("");
          }}
        >
          Cancel
        </div>
      </div>
    </AppModal>
  );
}
