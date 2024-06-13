"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function TxToast({ title, digest }: { title: string; digest?: string }) {
  const [url, setUrl] = useState<string>("");

  const account = useCurrentAccount();

  useEffect(() => {
    if (account?.chains[0] === "sui:testnet") setUrl(`https://suiscan.xyz/testnet/tx/${digest}`);
    // if (account?.chains[0] === "sui:mainnet") setUrl(`https://suiscan.xyz/mainnet/tx/${digest}`);
  }, [account?.chains, digest]);

  return (
    <div className="bg-white text-black shadow-lg rounded-xl flex items-center gap-3 py-4 px-6">
      <div>😃</div>
      <div>{url}</div>
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
