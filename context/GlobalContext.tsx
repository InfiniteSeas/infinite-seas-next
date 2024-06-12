"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useEnokiFlow, useAuthCallback } from "@mysten/enoki/react";
import toast from "react-hot-toast";

import { getCurrentPlayerId, suiPlayerInfo, suiPlayerSkillProcesses } from "@/actions/player.action";
import { suixEnergyCoins } from "@/actions/coin.action";
import { getSaltAndAddress } from "@/actions/system.action";

import { formatSui } from "@/utils/tools";

type GlobalContextType = {
  currentPlayerId: string;
  currentPlayerInfo?: any;
  skillProcesses: any[];
  refetchPlayer: () => Promise<void>;
  energyObjectIds: string[];
  energyBalance: number;
  refetchEnergy: () => Promise<void>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function useGlobalContext(): GlobalContextType {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalContext must be used within a GlobalContextProvider");

  return context;
}

export default function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const [currentUserAddress, setCurrentUserAddress] = useState<string>("");
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("");
  const [currentPlayerInfo, setCurrentPlayerInfo] = useState<any>();
  const [skillProcesses, setSkillProcesses] = useState<any[]>([]);

  const [energyObjectIds, setEnergyObjectIds] = useState<string[]>([]);
  const [energyBalance, setEnergyBalance] = useState<number>(0);

  const searchParams = useSearchParams();

  const enokiFlow = useEnokiFlow();
  const { handled } = useAuthCallback();

  // After login by OAuth, handle zkLogin logic
  useEffect(() => {
    async function handleZkLogin() {
      if (!handled) return;

      enokiFlow.getKeypair({ network: "testnet" });

      // Get jwt provided by OAuth and reset the url
      const jwt = searchParams.get("id_token");
      if (!jwt) return toast.error("Failed to connect your wallet!");
      window.location.href = "/";

      // Get user salt and address
      const user = await getSaltAndAddress({ jwt });
      setCurrentUserAddress(user.address);
    }

    handleZkLogin();
  }, [handled]);

  async function refetchPlayer() {
    if (!currentUserAddress) return;

    const playerId = await getCurrentPlayerId({ owner: currentUserAddress });
    const playerInfo = await suiPlayerInfo({ playerId });
    const processes = await suiPlayerSkillProcesses({ playerId });

    setCurrentPlayerId(playerId);
    setCurrentPlayerInfo(playerInfo);
    setSkillProcesses(processes);
  }

  async function refetchEnergy() {
    if (!currentUserAddress) return;

    const energyCoins = await suixEnergyCoins({ owner: currentUserAddress });
    if (energyCoins.length === 0) return;

    setEnergyObjectIds(energyCoins.map((coin) => coin.coinObjectId));

    let totalBalance = 0;
    energyCoins.forEach((coin) => (totalBalance += Number(coin.balance)));
    setEnergyBalance(formatSui(totalBalance.toString()));
  }

  return (
    <GlobalContext.Provider
      value={{
        currentPlayerId,
        currentPlayerInfo,
        skillProcesses,
        refetchPlayer,
        energyBalance,
        energyObjectIds,
        refetchEnergy,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
