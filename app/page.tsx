import GameWindow from "@/components/game/GameWindow";

import { getAllIslandsInfo } from "@/actions/map.action";
import { getPlayerInfo, getPlayerRosters, getPlayerSkillProcesses } from "@/actions/player.action";

export default async function page() {
  const info = await getAllIslandsInfo();

  const rosters = await getPlayerRosters({
    playerId: "0xe031a5d2793e9aed44cf9f9f4789d7a00194f42184cb77483a10819ba193d8d6",
  });

  // Get player info
  let oreLeft = 0;
  let woodLeft = 0;
  let seedsLeft = 0;
  const player = await getPlayerInfo({
    owner: "0xf94d322ddf060d4dc9a9bee56d61ed119f39e17b5a1098d62254a10e37a86cf9", // TODO: change to island owner
  });
  player.inventory.forEach((inv: { itemId: number; quantity: number }) => {
    if (inv.itemId === 2000000003) oreLeft = inv.quantity;
    if (inv.itemId === 2000000001) woodLeft = inv.quantity;
    if (inv.itemId === 2) seedsLeft = inv.quantity;
  });

  // Get player's skill processes
  const processes = await getPlayerSkillProcesses({ playerId: player.id });

  return (
    <main>
      <GameWindow
        islandOwnerName={player.name}
        islandOwnerExp={player.experience}
        islandOwnerLevel={player.level}
        oreLeft={oreLeft}
        woodLeft={woodLeft}
        seedsLeft={seedsLeft}
        skillProcesses={processes}
      />
    </main>
  );
}
