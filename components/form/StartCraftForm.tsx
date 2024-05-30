"use client";

import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { bcs } from "@mysten/bcs";
import toast from "react-hot-toast";

import TxToast from "@/components/shared/TxToast";

import { suixEnergyCoins } from "@/actions/coin.action";
import { getPlayerId } from "@/actions/player.action";
import { revalidateGame } from "@/actions/system.action";

import { ITEM_PRODUCTION_CRAFTING, MAIN_PACKAGE_ID } from "@/constant";

export default function StartCraftForm({
  copper,
  log,
  cotton,
  skillProcesses,
  handleCloseModal,
}: {
  copper: number;
  log: number;
  cotton: number;
  skillProcesses: any[];
  handleCloseModal: () => void;
}) {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();

  async function startCraftAction() {
    if (!currentAccount) return toast.error("Please login first!");

    if (copper < 3) return toast.error("Please add 3 copper at least!");
    if (log < 3) return toast.error("Please add 3 log at least!");
    if (cotton < 3) return toast.error("Please add 3 cotton at least!");
    if (copper + log + cotton < 15) return toast.error("The total resource added must be 15 at least!");

    const processId = skillProcesses.filter((process) => process.skillProcessId.skillType === 6)[0].id_;

    try {
      const energyCoins = await suixEnergyCoins({ owner: currentAccount.address });
      if (energyCoins.length === 0) return toast.error("You don't have enough energy coin, please buy some first!");

      toast.success("Starting crafting, please approve with your wallet...");

      const playerId = await getPlayerId({ owner: currentAccount.address });

      const txb = new TransactionBlock();

      txb.setGasBudget(42000000);

      const resources = bcs.vector(bcs.u32()).serialize([301, 200, 102]).toBytes();
      const quantities = bcs.vector(bcs.u32()).serialize([copper, log, cotton]).toBytes();

      txb.moveCall({
        target: `${MAIN_PACKAGE_ID}::skill_process_service::start_ship_production`,
        arguments: [
          txb.object(processId),
          txb.pure(resources),
          txb.pure(quantities),
          txb.object(playerId),
          txb.object(ITEM_PRODUCTION_CRAFTING),
          txb.object("0x6"),
          txb.object(energyCoins[0].coinObjectId),
        ],
      });

      const { digest } = await signAndExecuteTransactionBlockAsync({ transactionBlock: txb });
      toast.custom(<TxToast title="Craft started successfully!" digest={digest} />);

      revalidateGame();
    } catch (error: any) {
      toast.error(`Failed to start crafting: ${error.message}!`);
    }
  }

  return (
    <div className="w-[270px] h-[180px] flex flex-col justify-between items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-lg p-4">
      <div className="flex items-center gap-2">
        <span>small ship</span>
        <input className="w-[45px] border-[1px] text-center rounded-md" type="text" value="1" disabled />
      </div>
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
    </div>
  );
}
