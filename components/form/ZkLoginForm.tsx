"use client";

import Image from "next/image";
import { useEnokiFlow } from "@mysten/enoki/react";
import toast from "react-hot-toast";

import { GOOGLE_OAUTH_CLIENT_ID } from "@/constant";

export default function ZkLoginForm() {
  const enokiFlow = useEnokiFlow();

  async function zkLoginAction() {
    toast.loading("Using your Google account to connect your wallet...");

    const redirectUrl = "https://game.infiniteseas.io";

    try {
      // Init OAuth and get its login url
      const oAuthLoginUrl = await enokiFlow.createAuthorizationURL({
        provider: "google",
        network: "testnet",
        clientId: GOOGLE_OAUTH_CLIENT_ID,
        redirectUrl,
        extraParams: { scope: ["openid", "email", "profile"] },
      });

      // Navigate to its login url
      window.location.href = oAuthLoginUrl;
    } catch (error: any) {
      toast.error(`Failed to connect your wallet: ${error.message}!`);
    }
  }

  return (
    <Image
      className="cursor-pointer"
      src="/image/home/wallet.png"
      alt="wallet-button"
      width={50}
      height={50}
      priority
      onClick={zkLoginAction}
    />
  );
}
