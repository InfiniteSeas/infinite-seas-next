"use client";

import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient } from "@mysten/dapp-kit";
import { useEnokiFlow } from "@mysten/enoki/react";
import { bcs } from "@mysten/bcs";
import toast from "react-hot-toast";

import AppModal from "@/components/ui/AppModal";
import TxToast from "@/components/shared/TxToast";

import { waitForReceipt } from "@/actions/system.action";
import { ITEM_PRODUCTION_CRAFTING, MAIN_PACKAGE_ID } from "@/constant";
import { useGlobalContext } from "@/context/GlobalContext";

export default function StartCraftForm({
  shipCopper,
  shipLog,
  shipCotton,
  inventoryCopper,
  inventoryLog,
  inventoryCotton,
  handleCloseModal,
}: {
  shipCopper: number;
  shipLog: number;
  shipCotton: number;
  inventoryCopper: number;
  inventoryLog: number;
  inventoryCotton: number;
  handleCloseModal: () => void;
}) {
  const client = useSuiClient();
  const enokiFlow = useEnokiFlow();

  const { currentPlayerId, skillProcesses, energyObjectIds, energyBalance, refetchPlayer, refetchEnergy } =
    useGlobalContext();

  async function startCraftAction() {
    if (!currentPlayerId) return toast.error("Please login first!");

    if (inventoryCopper <= 0) return toast.error("Not enough copper in your inventory!");
    if (inventoryLog < 3) return toast.error("Not enough log in your inventory!");
    if (inventoryCotton < 3) return toast.error("Not enough cotton in your inventory!");
    if (shipCopper + shipLog + shipCotton !== 15) return toast.error("The total resources added must be 15!");

    const processId = skillProcesses.filter((process) => process.skillType === 6)[0].id_;

    if (energyBalance < 5) return toast.error("You don't have enough energy coin, please buy some first!");

    toast.loading("Starting crafting, it may take a while...");

    try {
      const tx = new Transaction();

      if (energyObjectIds.length > 1) tx.mergeCoins(tx.object(energyObjectIds[0]), energyObjectIds.slice(1));

      const resources = bcs.vector(bcs.u32()).serialize([301, 200, 102]).toBytes();
      const quantities = bcs.vector(bcs.u32()).serialize([shipCopper, shipLog, shipCotton]).toBytes();

      tx.moveCall({
        target: `${MAIN_PACKAGE_ID}::skill_process_service::start_ship_production`,
        arguments: [
          tx.object(processId),
          tx.pure(resources),
          tx.pure(quantities),
          tx.object(currentPlayerId),
          tx.object(ITEM_PRODUCTION_CRAFTING),
          tx.object("0x6"),
          tx.object(energyObjectIds[0]),
        ],
      });

      const { digest } = await client.signAndExecuteTransaction({
        signer: await enokiFlow.getKeypair({ network: "testnet" }),
        transaction: tx,
      });
      toast.loading("The transaction is sent to the blockchain, checking the result...");

      const { status, error } = await waitForReceipt({ digest });

      if (status === "success") {
        await refetchPlayer();
        await refetchEnergy();

        toast.custom(<TxToast title="Craft started successfully!" digest={digest} />);
      } else toast.error(`Failed to start crafting: ${error}`);
    } catch (error: any) {
      toast.error(`Failed to start crafting: ${error.message}!`);
    }
  }

  return (
    <AppModal frame="bg-frame-prod">
      <div className="w-96 flex flex-col items-center text-2xl text-white">
        <div className="flex flex-col items-center pt-8 pb-5 gap-2">
          <p>costs 5 energy token</p>
          <p>15 seconds time duration</p>
        </div>

        <div className="flex w-full items-center">
          <div
            className="flex-1 bg-frame-btn bg-center bg-no-repeat bg-[length:100%_100%] text-center cursor-pointer py-3"
            onClick={startCraftAction}
          >
            Create
          </div>

          <div
            className="flex-1 bg-frame-btn bg-center bg-no-repeat bg-[length:100%_100%] text-center cursor-pointer py-3"
            onClick={() => handleCloseModal()}
          >
            Cancel
          </div>
        </div>
      </div>
    </AppModal>
  );
}
