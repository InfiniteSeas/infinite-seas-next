"use client";

import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient } from "@mysten/dapp-kit";
import { useEnokiFlow } from "@mysten/enoki/react";
import toast from "react-hot-toast";

import AppModal from "@/components/ui/AppModal";
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

  const client = useSuiClient();
  const enokiFlow = useEnokiFlow();

  const { currentPlayerId, skillProcesses, energyObjectIds, energyBalance, refetchPlayer, refetchEnergy } =
    useGlobalContext();

  function getProductName() {
    if (productType === "ore") return "Ore";
    else if (productType === "wood") return "Wood";
    else if (productType === "seed") return "Seeds";
    else return "Unknown Product";
  }

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

    toast.loading("Starting creation, it may take a while...");

    try {
      const tx = new Transaction();

      if (energyObjectIds.length > 0) tx.mergeCoins(tx.object(energyObjectIds[0]), energyObjectIds.slice(1));

      tx.moveCall({
        target: `${MAIN_PACKAGE_ID}::skill_process_service::${functionName}`,
        arguments: [
          tx.object(skillProcessId),
          tx.pure.u32(Number(batchSize)),
          tx.object(currentPlayerId),
          tx.object(itemFormulaId),
          tx.object("0x6"),
          tx.object(energyObjectIds[0]),
        ],
      });

      console.log(await enokiFlow.getKeypair({ network: "testnet" }));

      const { digest } = await client.signAndExecuteTransaction({
        signer: await enokiFlow.getKeypair({ network: "testnet" }),
        transaction: tx,
      });
      toast.loading("The transaction is sent to the blockchain, checking the result...");

      const { status, error } = await waitForReceipt({ digest });

      if (status === "success") {
        await refetchPlayer();
        await refetchEnergy();

        toast.custom(<TxToast title="Creation started successfully!" digest={digest} />);
      } else toast.error(`Failed to start creation: ${error}`);
    } catch (error: any) {
      toast.error(`Failed to start creation: ${error.message}!`);
    }
  }

  return (
    <AppModal frame="bg-frame-prod">
      <div className="w-96 flex flex-col items-center text-2xl text-white">
        <div className="flex flex-col items-center pt-8 pb-5 gap-2">
          <div className="flex items-center gap-1">
            <label htmlFor="newPlayerName">{getProductName()}: </label>

            <input
              id="newPlayerName"
              className="w-32 bg-transparent border-b-[1px] border-white outline-none"
              type="text"
              value={batchSize}
              onChange={(e) => setBatchSize(e.target.value)}
            />
          </div>

          <p>Costs {["ore", "wood"].includes(productType) ? batchSize : Number(batchSize) * 5} energy token</p>

          {productType === "ore" && <p>Can harvest {batchSize} copper</p>}
          {productType === "wood" && <p>Can harvest {batchSize} wood</p>}
          {productType === "seed" && <p>Can harvest {Number(batchSize) * 5} cotton</p>}

          <p>
            {["ore", "wood"].includes(productType) ? Number(batchSize) * 3 : Number(batchSize) * 15} seconds duration
          </p>
        </div>

        <div className="flex w-full items-center">
          <div
            className="flex-1 bg-frame-btn bg-center bg-no-repeat bg-[length:100%_100%] text-center cursor-pointer py-3"
            onClick={startProductAction}
          >
            Create
          </div>

          <div
            className="flex-1 bg-frame-btn bg-center bg-no-repeat bg-[length:100%_100%] text-center cursor-pointer py-3"
            onClick={() => {
              handleCloseModal();
              setBatchSize("");
            }}
          >
            Cancel
          </div>
        </div>
      </div>
    </AppModal>
  );
}
