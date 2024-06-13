"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TxToast({ title, digest }: { title: string; digest?: string }) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    setUrl(`https://suiscan.xyz/testnet/tx/${digest}`);
  }, [digest]);

  return (
    <div className="bg-white text-black shadow-lg rounded-xl flex items-center gap-3 py-4 px-6">
      <div>😃</div>
      <div>
        <p className="line-clamp-2">{title}</p>
        <Link className="text-violet-700 hover:text-violet-600 duration-200" href={url} target="_blank">
          View on Suiscan
        </Link>
        .
      </div>
    </div>
  );
}
