import HarvestProductForm from "@/components/form/HarvestProductForm";

export default function ActionQueue({
  skillProcesses,
  unassignedRosterId,
}: {
  skillProcesses: any[];
  unassignedRosterId: string;
}) {
  const queueData = [
    { id: 0, action: "Mining", count: 0, resource: "Copper Ores", timeLeft: 0, productType: "ore" },
    { id: 1, action: "Wood Cutting", count: 0, resource: "Normal Trees", timeLeft: 0, productType: "wood" },
    { id: 2, action: "Planting", count: 0, resource: "Cotton Seeds", timeLeft: 0, productType: "seed1" },
    { id: 3, action: "Planting", count: 0, resource: "Cotton Seeds", timeLeft: 0, productType: "seed2" },
    { id: 4, action: "Crafting", count: 0, resource: "Small Ship", timeLeft: 0, productType: "craft" },
    { id: 5, action: "Sailing Roster", count: 0, resource: "", timeLeft: 0, productType: "" },
  ];

  return (
    <div className="absolute top-1/2 -left-[29%] -translate-y-1/2 bg-white p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-xl font-bold">action queue</h1>

        {queueData.map((data) => (
          <div key={data.id} className="flex justify-between items-center gap-2">
            <span>{data.action}</span>
            <span>{data.count}</span>
            <span>{data.resource}</span>
            <span>{data.timeLeft}s</span>
            {data.productType && (
              <HarvestProductForm
                productType={data.productType}
                skillProcesses={skillProcesses}
                unassignedRosterId={unassignedRosterId}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
