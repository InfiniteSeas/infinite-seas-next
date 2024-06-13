"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getFaucetHost, requestSuiFromFaucetV0 } from "@mysten/sui/faucet";
import { useAuthCallback, useEnokiFlow } from "@mysten/enoki/react";
import toast from "react-hot-toast";

import CreatePlayerForm from "@/components/form/CreatePlayerForm";
import { getCurrentPlayerId } from "@/actions/player.action";
import { useGlobalContext } from "@/context/GlobalContext";
import { GOOGLE_OAUTH_CLIENT_ID, REDIRECT_URL } from "@/constant";

export default function ZkLoginForm() {
  const [newPlayerFlag, setNewPlayerFlag] = useState<boolean>(false);

  const router = useRouter();

  const enokiFlow = useEnokiFlow();
  const { handled } = useAuthCallback();

  const { currentPlayerId, refetchPlayer, refetchEnergy } = useGlobalContext();

  useEffect(() => {
    if (!window.location.hash) return;

    const hash = window.location.hash.substring(1);
    const newUrl = window.location.origin + window.location.pathname + "?" + hash;
    window.history.replaceState(null, "", newUrl);
  }, []);

  useEffect(() => {
    async function handleZkStatus() {
      if (currentPlayerId || !handled || !enokiFlow.$zkLoginState.value?.address) return;

      toast.loading("Checking zero-knowledge proof status...");

      window.history.replaceState(null, "", window.location.origin + window.location.pathname);

      // Sui coin faucet, only sui testnet
      await requestSuiFromFaucetV0({
        host: getFaucetHost("testnet"),
        recipient: enokiFlow.$zkLoginState.value.address,
      });

      const playerId = await getCurrentPlayerId({ owner: enokiFlow.$zkLoginState.value.address });
      if (!playerId) return setNewPlayerFlag(true);

      await refetchPlayer();
      await refetchEnergy();

      toast.success("Logined Successfully!");
    }

    handleZkStatus();
  }, [handled, enokiFlow.$zkLoginState, currentPlayerId, refetchPlayer, refetchEnergy]);

  async function oAuthLoginAction() {
    toast.loading("Using your Google account to act a zero-knowledge login...");

    try {
      // Init OAuth and get its login url
      const oAuthLoginUrl = await enokiFlow.createAuthorizationURL({
        provider: "google",
        network: "testnet",
        clientId: GOOGLE_OAUTH_CLIENT_ID,
        redirectUrl: REDIRECT_URL,
        extraParams: { scope: ["openid", "email", "profile"] },
      });

      router.push(oAuthLoginUrl);
    } catch (error: any) {
      toast.error(`Failed to login: ${error.message}!`);
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
        onClick={oAuthLoginAction}
      />
    </>
  );
}
