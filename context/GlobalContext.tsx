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
  setRefetchPlayerFlag: React.Dispatch<React.SetStateAction<boolean>>;
  energyObjectId: string;
  energyBalance: number;
  setRefetchEnergyFlag: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [refetchPlayerFlag, setRefetchPlayerFlag] = useState<boolean>(false);

  const [energyObjectId, setEnergyObjectId] = useState<string>("");
  const [energyBalance, setEnergyBalance] = useState<number>(0);
  const [refetchEnergyFlag, setRefetchEnergyFlag] = useState<boolean>(false);

  const currentAccount = useCurrentAccount();

  useEffect(() => {
    async function refetchPlayer() {
      if (!currentAccount) return;

      const playerId = await getCurrentPlayerId({ owner: currentAccount.address });
      const playerInfo = await suiPlayerInfo({ playerId });
      const processes = await suiPlayerSkillProcesses({ playerId });

      setCurrentPlayerId(playerId);
      setCurrentPlayerInfo(playerInfo);
      setSkillProcesses(processes);
    }

    refetchPlayer();
  }, [currentAccount, refetchPlayerFlag]);

  useEffect(() => {
    async function refetchEnergy() {
      if (!currentAccount) return;

      const energyCoins = await suixEnergyCoins({ owner: currentAccount.address });
      if (energyCoins.length === 0) return;

      setEnergyObjectId(energyCoins[0].coinObjectId);
      setEnergyBalance(formatSui(energyCoins[0].balance));
    }

    refetchEnergy();
  }, [refetchEnergyFlag]);

  return (
    <GlobalContext.Provider
      value={{
        currentPlayerId,
        currentPlayerInfo,
        skillProcesses,
        setRefetchPlayerFlag,
        energyObjectId,
        energyBalance,
        setRefetchEnergyFlag,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
