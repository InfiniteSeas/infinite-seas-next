"use client";

import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient } from "@mysten/dapp-kit";
import { useEnokiFlow } from "@mysten/enoki/react";
import { bcs } from "@mysten/bcs";
import toast from "react-hot-toast";

import AppModal from "@/components/ui/AppModal";
import AppInput from "@/components/ui/AppInput";
import TxToast from "@/components/shared/TxToast";

import { waitForReceipt } from "@/actions/system.action";
import { ITEM_PRODUCTION_CRAFTING, MAIN_PACKAGE_ID } from "@/constant";
import { useGlobalContext } from "@/context/GlobalContext";

export default function StartCraftForm({
  copper,
  log,
  cotton,
  handleCloseModal,
}: {
  copper: number;
  log: number;
  cotton: number;
  handleCloseModal: () => void;
}) {
  const client = useSuiClient();
  const enokiFlow = useEnokiFlow();

  const { currentPlayerId, skillProcesses, energyObjectIds, energyBalance, refetchPlayer, refetchEnergy } =
    useGlobalContext();

  async function startCraftAction() {
    if (!currentPlayerId) return toast.error("Please login first!");

    if (copper < 3) return toast.error("Please add 3 copper at least!");
    if (log < 3) return toast.error("Please add 3 log at least!");
    if (cotton < 3) return toast.error("Please add 3 cotton at least!");
    if (copper + log + cotton !== 15) return toast.error("The total resource added must be 15!");

    const processId = skillProcesses.filter((process) => process.skillType === 6)[0].id_;

    try {
      if (energyBalance < 5) return toast.error("You don't have enough energy coin, please buy some first!");

      toast.loading("Starting crafting, please approve with your wallet...");

      const tx = new Transaction();

      if (energyObjectIds.length > 0) tx.mergeCoins(tx.object(energyObjectIds[0]), energyObjectIds.slice(1));

      const resources = bcs.vector(bcs.u32()).serialize([301, 200, 102]).toBytes();
      const quantities = bcs.vector(bcs.u32()).serialize([copper, log, cotton]).toBytes();

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
    <AppModal>
      <AppInput label="Small Ship" value="1" disabled={true} />

      <p>costs 5 energy token</p>
      <p>15 seconds time duration</p>

      <div className="w-4/5 flex justify-evenly items-center">
        <div className="hover:bg-[#e9e9e9] border-[1px] rounded-md cursor-pointer p-1" onClick={startCraftAction}>
          Create
        </div>
        <div className="hover:bg-[#e9e9e9] border-[1px] rounded-md cursor-pointer p-1" onClick={handleCloseModal}>
          Cancel
        </div>
      </div>
    </AppModal>
  );
}
