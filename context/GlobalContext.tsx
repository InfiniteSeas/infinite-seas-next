"use client";

import { createContext, useState, useContext } from "react";
import { useEnokiFlow } from "@mysten/enoki/react";

import { getCurrentPlayerId, suiPlayerInfo, suiPlayerSkillProcesses } from "@/actions/player.action";
import { suixEnergyCoins } from "@/actions/coin.action";

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
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("");
  const [currentPlayerInfo, setCurrentPlayerInfo] = useState<any>();
  const [skillProcesses, setSkillProcesses] = useState<any[]>([]);

  const [energyObjectIds, setEnergyObjectIds] = useState<string[]>([]);
  const [energyBalance, setEnergyBalance] = useState<number>(0);

  const enokiFlow = useEnokiFlow();

  async function refetchPlayer() {
    if (!enokiFlow.$zkLoginState.value?.address) return;

    const playerId = await getCurrentPlayerId({ owner: enokiFlow.$zkLoginState.value.address });
    const playerInfo = await suiPlayerInfo({ playerId });
    const processes = await suiPlayerSkillProcesses({ playerId });

    setCurrentPlayerId(playerId);
    setCurrentPlayerInfo(playerInfo);
    setSkillProcesses(processes);
  }

  async function refetchEnergy() {
    if (!enokiFlow.$zkLoginState.value?.address) return;

    const energyCoins = await suixEnergyCoins({ owner: enokiFlow.$zkLoginState.value.address });
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
