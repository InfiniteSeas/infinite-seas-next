"use client";

import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import toast from "react-hot-toast";

import TxToast from "@/components/shared/TxToast";
import { waitForReceipt } from "@/actions/system.action";
import { useGlobalContext } from "@/context/GlobalContext";
import { COIN_PACKAGE_ID, FAUCET } from "@/constant";

export default function EnergyFaucetForm() {
  const { mutateAsync: signAndExecuteTransactionBlockAsync } = useSignAndExecuteTransactionBlock();

  const { currentPlayerId, refetchEnergy } = useGlobalContext();

  async function faucetAction() {
    if (!currentPlayerId) return toast.error("Please login first!");

    toast.loading("Using the faucet, please approve with your wallet...");

    try {
      const txb = new TransactionBlock();

      txb.setGasBudget(11000000);

      txb.moveCall({
        target: `${COIN_PACKAGE_ID}::energy_faucet::request_a_drop`,
        arguments: [txb.object(FAUCET)],
      });

      const { digest } = await signAndExecuteTransactionBlockAsync({ transactionBlock: txb });
      toast.loading("The transaction is sent to the blockchain, please wait a sec for result...");

      const receipt = await waitForReceipt({ digest });

      if (receipt.effects?.status.status === "success") {
        await refetchEnergy();
        toast.custom(<TxToast title="Faucet used successfully!" digest={digest} />);
      } else toast.error(`Failed to use the faucet: ${receipt.effects?.status.error}`);
    } catch (error: any) {
      toast.error(`Failed to use the faucet: ${error.message}!`);
    }
  }

  return (
    <>
      {currentPlayerId && (
        <button
          className="absolute top-36 right-24 bg-zinc-900/80 text-white text-xl rounded-lg px-2 py-1"
          type="button"
          onClick={faucetAction}
        >
          Faucet
        </button>
      )}
    </>
  );
}
