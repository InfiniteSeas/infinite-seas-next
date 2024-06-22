"use client";

import React, { useEffect, useState } from "react";

export default function Countdown({ initialCount, startedAt }: { initialCount: number; startedAt: string }) {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    setCount(initialCount);

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialCount, startedAt]);

  return <span className="text-white">{count}s</span>;
}
