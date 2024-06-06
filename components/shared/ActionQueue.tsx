import HarvestProductForm from "@/components/form/HarvestProductForm";
import Countdown from "@/components/queue/Countdown";

export default function ActionQueue({ unassignedRosterId }: { unassignedRosterId: string }) {
  const queueData = [
    { id: 0, action: "Mining", count: 0, resource: "Copper Ore", timeLeft: 0, productType: "ore" },
    { id: 1, action: "Cutting", count: 0, resource: "Normal Trees", timeLeft: 0, productType: "wood" },
    { id: 2, action: "Planting", count: 0, resource: "Cotton Seeds", timeLeft: 0, productType: "seed1" },
    { id: 3, action: "Planting", count: 0, resource: "Cotton Seeds", timeLeft: 0, productType: "seed2" },
    { id: 4, action: "Crafting", count: 0, resource: "Small Ships", timeLeft: 0, productType: "craft" },
    { id: 5, action: "Sailing", count: 0, resource: "", timeLeft: 0, productType: "" },
  ];

  return (
    <div className="fixed top-1/2 left-2 -translate-y-1/2 bg-center bg-no-repeat bg-frame-lg bg-[length:100%_100%] p-6 z-0">
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-xl text-white font-bold">Action Queue</h1>

        {queueData.map((data) => (
          <div key={data.id} className="flex justify-between items-center text-sm gap-1.5">
            <span className="text-zinc-400">{data.action}</span>
            <span className="text-white">{data.count}</span>
            <span className="text-zinc-400">{data.resource}</span>
            <Countdown initialCount={data.timeLeft} />
            {data.productType && (
              <HarvestProductForm productType={data.productType} unassignedRosterId={unassignedRosterId} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
