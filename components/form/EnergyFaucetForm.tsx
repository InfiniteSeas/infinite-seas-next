"use client";

import Image from "next/image";
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
        <div className="absolute top-36 right-14 text-white flex flex-col items-center" onClick={faucetAction}>
          <button
            className="bg-frame-btn bg-center bg-no-repeat bg-[length:100%_100%] flex items-center text-lg px-4 py-2 gap-2 z-10"
            type="button"
          >
            <Image src="/image/energy/energy-icon.png" alt="energy-icon" width={20} height={40} priority />
            <span>Claim Energy</span>
          </button>

          <button
            className="bg-frame-btn bg-center bg-no-repeat bg-[length:100%_100%] flex items-center text-sm px-4 py-1 -mt-1.5 gap-2 z-0"
            type="button"
          >
            Available now
          </button>
        </div>
      )}
    </>
  );
}
