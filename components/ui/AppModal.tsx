"use client";

export default function AppModal({ frame, children }: { frame?: string; children: React.ReactNode }) {
  return (
    <div
      className={`flex justify-between items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${frame} bg-center bg-no-repeat bg-[length:100%_100%] gap-2`}
    >
      {children}
    </div>
  );
}
