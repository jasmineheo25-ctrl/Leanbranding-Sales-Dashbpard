"use client";

import { useMemo, useState } from "react";
import MallTabs, { type MallFilter } from "@/components/MallTabs";
import MallBadge from "@/components/MallBadge";
import StatusPill from "@/components/StatusPill";
import StatCard from "@/components/StatCard";
import { BANK_TRANSFER_ROWS } from "@/lib/mock-data";
import { formatWon } from "@/lib/format";

export default function BankTransferPage() {
  const [mall, setMall] = useState<MallFilter>("all");

  const rows = useMemo(
    () => BANK_TRANSFER_ROWS.filter((r) => mall === "all" || r.mall === mall),
    [mall],
  );

  const unconfirmedCount = rows.filter((r) => !r.confirmed).length;
  const unconfirmedAmount = rows
    .filter((r) => !r.confirmed)
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">무통장입금 고객 리스트</h1>
          <p className="text-sm text-zinc-500">입금 확인이 필요한 주문 현황</p>
        </div>
        <MallTabs value={mall} onChange={setMall} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="전체 건수" value={`${rows.length}건`} />
        <StatCard label="미확인 건수" value={`${unconfirmedCount}건`} hint="입금자명 대조 필요" />
        <StatCard label="미확인 금액" value={formatWon(unconfirmedAmount)} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">주문번호</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">몰</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">고객명</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">입금자명</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">입금금액</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">주문일</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">확인상태</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.orderNo} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-zinc-600">{r.orderNo}</td>
                <td className="px-4 py-3"><MallBadge mall={r.mall} /></td>
                <td className="px-4 py-3">{r.customerName}</td>
                <td className="px-4 py-3">
                  <span className={r.depositorName !== r.customerName ? "text-amber-600" : ""}>
                    {r.depositorName}
                  </span>
                </td>
                <td className="px-4 py-3">{formatWon(r.amount)}</td>
                <td className="px-4 py-3 text-zinc-600">{r.orderDate}</td>
                <td className="px-4 py-3">
                  <StatusPill status={r.confirmed ? "확인" : "미확인"} />
                </td>
                <td className="px-4 py-3">
                  {!r.confirmed && (
                    <button className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
                      입금 확인
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
