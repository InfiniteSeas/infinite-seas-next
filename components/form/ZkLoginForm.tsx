"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useEnokiFlow } from "@mysten/enoki/react";
import toast from "react-hot-toast";

import AppModal from "@/components/ui/AppModal";
import AppInput from "@/components/ui/AppInput";
import TxToast from "@/components/shared/TxToast";

import { GOOGLE_OAUTH_CLIENT_ID } from "@/constant";

export default function ZkLoginForm() {
  const [username, setUsername] = useState<string>("");
  const [modalFlag, setModalFlag] = useState<boolean>(false);

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
    <>
      {modalFlag && (
        <AppModal frame={""}>
          <AppInput label="Enter new username" value={username} handleChange={(value) => setUsername(value)} />

          <div className="flex w-4/5 justify-evenly items-center">
            <div
              className="hover:bg-[#e9e9e9] border-[1px] border-black rounded-md px-2 cursor-pointer"
              // onClick={createAction}
            >
              Create
            </div>

            <div
              className="hover:bg-[#e9e9e9] border-[1px] border-black rounded-md px-2 cursor-pointer"
              onClick={() => setModalFlag(false)}
            >
              Cancel
            </div>
          </div>
        </AppModal>
      )}

      <Image
        className="cursor-pointer"
        src="/image/home/wallet.png"
        alt="wallet-button"
        width={50}
        height={50}
        priority
        onClick={zkLoginAction}
      />
    </>
  );
}
