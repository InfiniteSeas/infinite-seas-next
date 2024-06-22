"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useConnectWallet, useCurrentAccount, useWallets } from "@mysten/dapp-kit";
import toast from "react-hot-toast";

import CreatePlayerForm from "@/components/form/CreatePlayerForm";
import { getCurrentPlayerId } from "@/actions/player.action";
import { useGlobalContext } from "@/context/GlobalContext";

export default function ConnectWalletForm() {
  const [newPlayerFlag, setNewPlayerFlag] = useState<boolean>(false);

  const wallets = useWallets();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: connectAsync } = useConnectWallet();

  const { refetchPlayer, refetchEnergy } = useGlobalContext();

  useEffect(() => {
    // Cannot put this logic in to connectAction directly,
    // because though connectAsync is done, currentAccount is not ready
    async function refetchWhenAccountReady() {
      if (newPlayerFlag || !currentAccount) return;

      await refetchPlayer();
      await refetchEnergy();

      toast.success("Wallet connected!");
    }

    refetchWhenAccountReady();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  async function connectAction() {
    try {
      toast.loading("Connecting your wallet...");

      const { accounts } = await connectAsync({ wallet: wallets[0] });

      const playerId = await getCurrentPlayerId({ owner: accounts[0].address });
      if (!playerId) return setNewPlayerFlag(true);

      // After this is the useEffect watcher
    } catch (error: any) {
      toast.error(`Failed to connect player: ${error.message}!`);
    }
  }

  return (
    <>
      {newPlayerFlag && <CreatePlayerForm handleCloseModal={() => setNewPlayerFlag(false)} />}

      <Image
        className="cursor-pointer"
        src="/image/home/wallet.png"
        alt="wallet-button"
        width={50}
        height={50}
        priority
        onClick={connectAction}
      />
    </>
  );
}
