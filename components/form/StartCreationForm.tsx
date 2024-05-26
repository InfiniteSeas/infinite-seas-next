"use client";

import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import toast from "react-hot-toast";

import TxToast from "@/components/shared/TxToast";
import { ITEM_CREATION_MINING, ITEM_CREATION_WOODING, ITEM_PRODUCTION_FARMING, MAIN_PACKAGE_ID } from "@/constant";
import { suixEnergyCoins } from "@/actions/coin.action";
import { getPlayerInfo } from "@/actions/player.action";

export default function StartCreationForm({
  productType,
  skillProcesses,
  handleCloseModal,
}: {
  productType: string;
  skillProcesses: any[];
  handleCloseModal: () => void;
}) {
  const [batchSize, setBatchSize] = useState<string>("0");

  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();

  async function startCreationAction() {
    if (!currentAccount) return toast.error("Please login first!");

    let functionName = "";
    let skillProcessId = "";
    let itemFormulaId = "";

    let oreLeft = 0;
    let woodLeft = 0;
    let seedsLeft = 0;
    const { inventory } = await getPlayerInfo({ owner: currentAccount.address });
    inventory.forEach((inv: { itemId: number; quantity: number }) => {
      if (inv.itemId === 2000000003) oreLeft = inv.quantity;
      if (inv.itemId === 2000000001) woodLeft = inv.quantity;
      if (inv.itemId === 2) seedsLeft = inv.quantity;
    });

    // If the player does mining
    if (productType === "ore") {
      if (Number(batchSize) > oreLeft) return toast.error("Not enough ore left!");
      functionName = "start_creation";
      skillProcessId = skillProcesses.filter((process) => process.skillProcessId.skillType === 3)[0].id_;
      itemFormulaId = ITEM_CREATION_MINING;
    }

    // If the player does wood cutting
    else if (productType === "wood") {
      if (Number(batchSize) > woodLeft) return toast.error("Not enough wood left!");
      functionName = "start_creation";
      skillProcessId = skillProcesses.filter((process) => process.skillProcessId.skillType === 1)[0].id_;
      itemFormulaId = ITEM_CREATION_WOODING;
    }

    // If the player does seed farming
    else if (productType === "seed") {
      if (Number(batchSize) > seedsLeft) return toast.error("Not enough cotton seed left!");
      functionName = "start_production";
      skillProcessId = skillProcesses.filter((process) => process.skillProcessId.skillType === 0)[0].id_;
      itemFormulaId = ITEM_PRODUCTION_FARMING;
    }

    const energyCoins = await suixEnergyCoins({ owner: currentAccount.address });
    if (energyCoins.length === 0) return toast.error("You don't have enough energy coin, please buy some first!");

    toast.success("Starting creation, please wait a sec...");

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
          onClick={startCreationAction}
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
