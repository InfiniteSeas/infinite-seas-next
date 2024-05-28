import GameWindow from "@/components/game/GameWindow";

import { suiAllIslandsInfo } from "@/actions/map.action";
import { getPlayerInfo, getPlayerRosters, getPlayerSkillProcesses } from "@/actions/player.action";

export default async function page() {
  const info = await suiAllIslandsInfo();

  const rosters = await getPlayerRosters({
    playerId: "0xe031a5d2793e9aed44cf9f9f4789d7a00194f42184cb77483a10819ba193d8d6",
  });

  // Get player info
  const player = await getPlayerInfo({
    owner: "0xf94d322ddf060d4dc9a9bee56d61ed119f39e17b5a1098d62254a10e37a86cf9", // TODO: change to island owner
  });

  let oreLeft = 0;
  let woodLeft = 0;
  let seedsLeft = 0;
  let copperLeft = 0;
  let logLeft = 0;
  let cottonLeft = 0;
  player.inventory.forEach((inv: any) => {
    if (inv.fields.item_id === 2000000003) oreLeft = inv.fields.quantity;
    else if (inv.fields.item_id === 2000000001) woodLeft = inv.fields.quantity;
    else if (inv.fields.item_id === 2) seedsLeft = inv.fields.quantity;
    else if (inv.fields.item_id === 301) copperLeft = inv.fields.quantity;
    else if (inv.fields.item_id === 200) logLeft = inv.fields.quantity;
    else if (inv.fields.item_id === 102) cottonLeft = inv.fields.quantity;
  });

  // Get player's skill processes
  const processes = await getPlayerSkillProcesses({ playerId: player.id.id });

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
        copperLeft={copperLeft}
        logLeft={logLeft}
        cottonLeft={cottonLeft}
      />
    </main>
  );
}
