"use client";

import { useMemo, useState } from "react";
import MallTabs, { type MallFilter } from "@/components/MallTabs";
import MallBadge from "@/components/MallBadge";
import StatusPill from "@/components/StatusPill";
import StatCard from "@/components/StatCard";
import { SALES_ROWS } from "@/lib/mock-data";
import { formatWon } from "@/lib/format";

export default function SalesPage() {
  const [mall, setMall] = useState<MallFilter>("all");

  const rows = useMemo(
    () => SALES_ROWS.filter((r) => mall === "all" || r.mall === mall),
    [mall],
  );

  const totalPaid = rows.reduce((sum, r) => sum + r.paidAmount, 0);
  const orderCount = rows.length;
  const cancelCount = rows.filter((r) => r.status === "취소").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">매출확인</h1>
          <p className="text-sm text-zinc-500">몰별 주문 및 매출 현황</p>
        </div>
        <MallTabs value={mall} onChange={setMall} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="주문 건수" value={`${orderCount}건`} />
        <StatCard label="결제 금액 합계" value={formatWon(totalPaid)} />
        <StatCard label="취소 건수" value={`${cancelCount}건`} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">주문번호</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">몰</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">주문일</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">상품명</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">수량</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">판매가</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">결제금액</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.orderNo} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-zinc-600">{r.orderNo}</td>
                <td className="px-4 py-3"><MallBadge mall={r.mall} /></td>
                <td className="px-4 py-3 text-zinc-600">{r.orderDate}</td>
                <td className="px-4 py-3">{r.productName}</td>
                <td className="px-4 py-3">{r.qty}</td>
                <td className="px-4 py-3">{formatWon(r.price)}</td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">{formatWon(r.paidAmount)}</td>
                <td className="px-4 py-3"><StatusPill status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
