import { getAllIslandsInfo } from "@/actions/map.action";
import GameWindow from "@/components/game/GameWindow";

export default async function page() {
  const info = await getAllIslandsInfo();

  return (
    <main>
      <GameWindow />
    </main>
  );
}
