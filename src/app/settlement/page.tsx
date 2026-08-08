"use client";

import { useMemo, useState } from "react";
import MallTabs, { type MallFilter } from "@/components/MallTabs";
import MallBadge from "@/components/MallBadge";
import StatusPill from "@/components/StatusPill";
import StatCard from "@/components/StatCard";
import { SETTLEMENT_ROWS } from "@/lib/mock-data";
import { formatWon } from "@/lib/format";

export default function SettlementPage() {
  const [mall, setMall] = useState<MallFilter>("all");

  const rows = useMemo(
    () => SETTLEMENT_ROWS.filter((r) => mall === "all" || r.mall === mall),
    [mall],
  );

  const totalSettled = rows.reduce((sum, r) => sum + r.settledAmount, 0);
  const totalFee = rows.reduce((sum, r) => sum + r.fee, 0);
  const pendingCount = rows.filter((r) => r.status === "정산대기").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">정산</h1>
          <p className="text-sm text-zinc-500">몰별 월간 정산 현황</p>
        </div>
        <MallTabs value={mall} onChange={setMall} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="정산 금액 합계" value={formatWon(totalSettled)} />
        <StatCard label="수수료 합계" value={formatWon(totalFee)} />
        <StatCard label="정산 대기" value={`${pendingCount}건`} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">정산월</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">몰</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">총매출</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">수수료</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">정산금액</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.month}-${r.mall}-${i}`} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 text-zinc-600">{r.month}</td>
                <td className="px-4 py-3"><MallBadge mall={r.mall} /></td>
                <td className="px-4 py-3">{formatWon(r.totalSales)}</td>
                <td className="px-4 py-3 text-zinc-500">-{formatWon(r.fee)}</td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">{formatWon(r.settledAmount)}</td>
                <td className="px-4 py-3"><StatusPill status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
