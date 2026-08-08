"use client";

import { MALLS, type MallId } from "@/lib/malls";

export type MallFilter = MallId | "all";

export default function MallTabs({
  value,
  onChange,
}: {
  value: MallFilter;
  onChange: (v: MallFilter) => void;
}) {
  const options: { id: MallFilter; label: string }[] = [
    { id: "all", label: "전체" },
    ...MALLS.map((m) => ({ id: m.id, label: m.name })),
  ];

  return (
    <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === opt.id
              ? "bg-zinc-900 text-white"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
