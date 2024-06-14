import GameWindow from "@/components/game/GameWindow";
import { suiAllIslandsInfo } from "@/actions/map.action";

export default async function page() {
  const islandsInfo = await suiAllIslandsInfo();

  return <GameWindow islandsInfo={islandsInfo} />;
}
