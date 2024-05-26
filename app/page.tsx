import GameWindow from "@/components/game/GameWindow";

import { getAllIslandsInfo } from "@/actions/map.action";
import { getUserInfo } from "@/actions/user.action";

export default async function page() {
  const info = await getAllIslandsInfo();

  return (
    <main>
      <GameWindow />
    </main>
  );
}
