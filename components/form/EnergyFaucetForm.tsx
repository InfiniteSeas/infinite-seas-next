"use client";

import { useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useEnokiFlow } from "@mysten/enoki/react";
import toast from "react-hot-toast";

import TxToast from "@/components/shared/TxToast";
import { waitForReceipt } from "@/actions/system.action";
import { useGlobalContext } from "@/context/GlobalContext";
import { COIN_PACKAGE_ID, FAUCET } from "@/constant";

export default function EnergyFaucetForm() {
  const client = useSuiClient();
  const enokiFlow = useEnokiFlow();

  const { refetchEnergy } = useGlobalContext();

  async function faucetAction() {
    if (!enokiFlow.$zkLoginState.value?.address) return toast.error("Please login first!");

    toast.loading("Using the faucet to get testnet energy token...");

    try {
      const tx = new Transaction();

      tx.setSender(enokiFlow.$zkLoginState.value.address);

      tx.setGasBudget(11000000);

      tx.moveCall({
        target: `${COIN_PACKAGE_ID}::energy_faucet::request_a_drop`,
        arguments: [tx.object(FAUCET)],
      });

      const { digest } = await client.signAndExecuteTransaction({
        signer: await enokiFlow.getKeypair({ network: "testnet" }),
        transaction: tx,
      });
      toast.loading("The transaction is sent to the blockchain, please wait a sec for result...");

      const { status, error } = await waitForReceipt({ digest });

      if (status === "success") {
        await refetchEnergy();
        toast.custom(<TxToast title="Faucet used successfully!" digest={digest} />);
      } else toast.error(`Failed to use the faucet: ${error}`);
    } catch (error: any) {
      toast.error(`Failed to use the faucet: ${error.message}!`);
    }
  }

  return (
    <>
      {enokiFlow.$zkLoginState.value?.address && (
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
