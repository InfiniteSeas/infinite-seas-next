"use client";

import { useEffect, useState } from "react";
import HarvestProductForm from "@/components/form/HarvestProductForm";
import Countdown from "@/components/ui/Countdown";

import { useGlobalContext } from "@/context/GlobalContext";
import { calculateTimeRemainingInSec } from "@/utils/tools";

export default function ActionQueue() {
  const [queueData, setQueueData] = useState<any[]>([]);

  const { skillProcesses } = useGlobalContext();

  useEffect(() => {
    const queue = skillProcesses.map((process) => {
      let action,
        resource = "";

      if (process.skillType === 0) {
        action = "Planting";
        resource = "Cotton Seeds";
      } else if (process.skillType === 1) {
        action = "Cutting";
        resource = "Normal Trees";
      } else if (process.skillType === 3) {
        action = "Mining";
        resource = "Copper Ore";
      } else if (process.skillType === 6) {
        action = "Crafting";
        resource = "Small Ships";
      }

      const timeLeft = calculateTimeRemainingInSec(process.startedAt, process.creationTime);

      return {
        ...process,
        batchSize: process.completed ? 0 : process.batchSize,
        timeLeft,
        action,
        resource,
      };
    });

    setQueueData(queue);
  }, [skillProcesses]);

  return (
    <>
      {queueData.length > 0 && (
        <div className="fixed top-1/2 left-2 -translate-y-1/2 w-64 bg-center bg-no-repeat bg-frame-lg bg-[length:100%_100%] py-6 z-30">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-xl text-white font-bold">Action Queue</h1>

            {queueData.map((data) => (
              <div key={data.id_} className="flex justify-between items-center text-sm gap-1.5">
                <span className="text-zinc-400">{data.action}</span>

                <span className="text-white">{data.batchSize}</span>

                <span className="text-zinc-400">{data.resource}</span>

                <HarvestProductForm
                  processId={data.id_}
                  skillType={data.skillType}
                  processCompleted={data.completed}
                  initialCount={data.timeLeft}
                  startedAt={data.startedAt}
                />
              </div>
            ))}

            <div className="flex justify-between items-center text-sm gap-1.5">
              <span className="text-zinc-400">Sailing</span>
              <span className="text-white">0</span>
              <Countdown initialCount={0} startedAt="" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
