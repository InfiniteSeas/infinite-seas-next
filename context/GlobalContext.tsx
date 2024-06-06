"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

import { getCurrentPlayerId, suiPlayerInfo, suiPlayerSkillProcesses } from "@/actions/player.action";
import { suixEnergyCoins } from "@/actions/coin.action";

import { formatSui } from "@/utils/tools";

type GlobalContextType = {
  currentPlayerId: string;
  currentPlayerInfo?: any;
  skillProcesses: any[];
  refetchPlayer: () => Promise<void>;
  energyObjectId: string;
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
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("");
  const [currentPlayerInfo, setCurrentPlayerInfo] = useState<any>();
  const [skillProcesses, setSkillProcesses] = useState<any[]>([]);

  const [energyObjectId, setEnergyObjectId] = useState<string>("");
  const [energyBalance, setEnergyBalance] = useState<number>(0);

  const currentAccount = useCurrentAccount();

  async function refetchPlayer() {
    if (!currentAccount) return;

    const playerId = await getCurrentPlayerId({ owner: currentAccount.address });
    const playerInfo = await suiPlayerInfo({ playerId });
    const processes = await suiPlayerSkillProcesses({ playerId });

    setCurrentPlayerId(playerId);
    setCurrentPlayerInfo(playerInfo);
    setSkillProcesses(processes);
  }

  async function refetchEnergy() {
    if (!currentAccount) return;

    const energyCoins = await suixEnergyCoins({ owner: currentAccount.address });
    if (energyCoins.length === 0) return;

    setEnergyObjectId(energyCoins[0].coinObjectId);
    setEnergyBalance(formatSui(energyCoins[0].balance));
  }

  return (
    <GlobalContext.Provider
      value={{
        currentPlayerId,
        currentPlayerInfo,
        skillProcesses,
        refetchPlayer,
        energyObjectId,
        energyBalance,
        refetchEnergy,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
