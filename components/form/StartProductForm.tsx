"use client";

import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import toast from "react-hot-toast";

import TxToast from "@/components/shared/TxToast";

import { suixEnergyCoins } from "@/actions/coin.action";
import { revalidateGame } from "@/actions/system.action";

import { ITEM_CREATION_MINING, ITEM_CREATION_WOODING, ITEM_PRODUCTION_FARMING, MAIN_PACKAGE_ID } from "@/constant";

export default function StartProductForm({
  productType,
  oreLeft,
  woodLeft,
  seedsLeft,
  skillProcesses,
  handleCloseModal,
}: {
  productType: string;
  skillProcesses: any[];
  oreLeft: number;
  woodLeft: number;
  seedsLeft: number;
  handleCloseModal: () => void;
}) {
  const [batchSize, setBatchSize] = useState<string>("0");

  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();

  async function startProductAction() {
    if (!currentAccount) return toast.error("Please login first!");

    let functionName = "";
    let skillProcessId = "";
    let itemFormulaId = "";

    // If the player does mining
    if (productType === "ore") {
      if (Number(batchSize) > oreLeft) return toast.error("Not enough ore left!");

      const miningProcess = skillProcesses.filter((process) => process.skillProcessId.skillType === 3)[0];
      if (!miningProcess.completed)
        return toast.error("Please wait for the end of the mining process and harvest first!");

      functionName = "start_creation";
      skillProcessId = miningProcess.id_;
      itemFormulaId = ITEM_CREATION_MINING;
    }

    // If the player does wood cutting
    else if (productType === "wood") {
      if (Number(batchSize) > woodLeft) return toast.error("Not enough wood left!");

      const woodCuttingProcess = skillProcesses.filter((process) => process.skillProcessId.skillType === 1)[0];
      if (!woodCuttingProcess.completed)
        return toast.error("Please wait for the end of the wood cutting process and harvest first!");

      functionName = "start_creation";
      skillProcessId = woodCuttingProcess.id_;
      itemFormulaId = ITEM_CREATION_WOODING;
    }

    // If the player does seed farming
    else if (productType === "seed") {
      if (Number(batchSize) > seedsLeft) return toast.error("Not enough cotton seed left!");

      const seedingProcesses: any[2] = skillProcesses.filter((process) => process.skillProcessId.skillType === 0);
      if (seedingProcesses[0].completed) skillProcessId = seedingProcesses[0].id_;
      else if (seedingProcesses[1].completed) skillProcessId = seedingProcesses[1].id_;
      else return toast.error("Please wait for the end of the seeding process and harvest first!");

      functionName = "start_production";
      itemFormulaId = ITEM_PRODUCTION_FARMING;
    }

    const energyCoins = await suixEnergyCoins({ owner: currentAccount.address });
    if (energyCoins.length === 0) return toast.error("You don't have enough energy coin, please buy some first!");

    toast.success("Starting creation, please approve with your wallet...");

    try {
      const txb = new TransactionBlock();

      txb.setGasBudget(11000000);

      txb.moveCall({
        target: `${MAIN_PACKAGE_ID}::skill_process_service::${functionName}`,
        arguments: [
          txb.object(skillProcessId),
          txb.pure.u32(Number(batchSize)),
          txb.object("0xe031a5d2793e9aed44cf9f9f4789d7a00194f42184cb77483a10819ba193d8d6"), // TODO: need to change
          txb.object(itemFormulaId),
          txb.object("0x6"),
          txb.object(energyCoins[0].coinObjectId),
        ],
      });

      const { digest } = await signAndExecuteTransactionBlockAsync({ transactionBlock: txb });
      toast.custom(<TxToast title="Creation started successfully!" digest={digest} />);

      revalidateGame();
    } catch (error: any) {
      toast.error(`Failed to start creation: ${error.message}!`);
    }
  }

  return (
    <div className="w-[270px] h-[180px] flex flex-col justify-between items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-lg p-4">
      <div className="flex items-center gap-2">
        <span>{productType}</span>
        <input
          className="w-[45px] border-[1px] border-black text-center rounded-md"
          type="text"
          value={batchSize}
          onChange={(e) => setBatchSize(e.target.value)}
        />
      </div>

      <p>costs {batchSize} energy token</p>

      <p>
        {productType === "ore"
          ? Number(batchSize) * 3
          : productType === "wood"
          ? Number(batchSize) * 8
          : Number(batchSize) * 36}{" "}
        seconds time duration
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
    </div>
  );
}
