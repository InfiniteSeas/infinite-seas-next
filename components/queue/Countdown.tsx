"use client";

import React, { useEffect, useState } from "react";

export default function Countdown({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    if (count <= 0) return;

    const timer = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [count]);

  return <span className="text-white">{count}s</span>;
}
