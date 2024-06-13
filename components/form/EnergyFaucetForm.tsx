"use client";

import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient } from "@mysten/dapp-kit";
import { useEnokiFlow } from "@mysten/enoki/react";
import toast from "react-hot-toast";

import TxToast from "@/components/shared/TxToast";
import { waitForReceipt } from "@/actions/system.action";
import { useGlobalContext } from "@/context/GlobalContext";
import { COIN_PACKAGE_ID, FAUCET } from "@/constant";

export default function EnergyFaucetForm() {
  const client = useSuiClient();
  const enokiFlow = useEnokiFlow();

  const { currentPlayerId, refetchEnergy } = useGlobalContext();

  async function faucetAction() {
    if (!currentPlayerId) return toast.error("Please login first!");

    toast.loading("Requesting testnet energy coins, it may take a while...");

    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${COIN_PACKAGE_ID}::energy_faucet::request_a_drop`,
        arguments: [tx.object(FAUCET)],
      });

      const { digest } = await client.signAndExecuteTransaction({
        signer: await enokiFlow.getKeypair({ network: "testnet" }),
        transaction: tx,
      });
      toast.loading("The transaction is sent to the blockchain, checking the result...");

      const { status, error } = await waitForReceipt({ digest });

      if (status === "success") {
        await refetchEnergy();
        toast.custom(<TxToast title="Energy token sent successfully!" digest={digest} />);
      } else toast.error(`Failed to use the faucet: ${error}`);
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
