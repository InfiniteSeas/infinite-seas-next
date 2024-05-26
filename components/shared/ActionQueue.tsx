export default function ActionQueue() {
  const queueData = [
    { id: 0, action: "Mining", count: 0, resource: "Copper Ores ---------", timeLeft: 0 },
    { id: 1, action: "Crafting", count: 0, resource: "Small Ship ---------", timeLeft: 0 },
    { id: 2, action: "Wood Cutting", count: 0, resource: "Normal Trees ---------", timeLeft: 0 },
    { id: 3, action: "Planting", count: 0, resource: "Seed Seeds ---------", timeLeft: 0 },
    { id: 4, action: "sailing Roster", count: 0, resource: "---------", timeLeft: 0 },
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
          </div>
        ))}
      </div>
    </div>
  );
}
