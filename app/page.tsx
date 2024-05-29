import GameWindow from "@/components/game/GameWindow";
import { suiAllIslandsInfo } from "@/actions/map.action";

export default async function page() {
  const infos = await suiAllIslandsInfo();

  const islandsInfo = infos.map((info) => {
    return {
      occupiedBy: info.occupied_by,
      coordinates: { x: info.coordinates.fields.x, y: info.coordinates.fields.y },
      resources: info.resources,
    };
  });

  return (
    <main>
      <GameWindow islandsInfo={islandsInfo} />
    </main>
  );
}
