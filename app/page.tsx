import GameWindow from "@/components/game/GameWindow";

import { getAllIslandsInfo } from "@/actions/map.action";
import { getPlayerRosters, getPlayerSkillProcesses } from "@/actions/player.action";

export default async function page() {
  const info = await getAllIslandsInfo();

  const rosters = await getPlayerRosters({
    playerId: "0xe031a5d2793e9aed44cf9f9f4789d7a00194f42184cb77483a10819ba193d8d6",
  });

  const skillProcesses = await getPlayerSkillProcesses({
    playerId: "0xe031a5d2793e9aed44cf9f9f4789d7a00194f42184cb77483a10819ba193d8d6",
  });

  return (
    <main>
      <GameWindow />
    </main>
  );
}
