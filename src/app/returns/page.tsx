"use client";

import { useMemo, useState } from "react";
import MallTabs, { type MallFilter } from "@/components/MallTabs";
import MallBadge from "@/components/MallBadge";
import StatusPill from "@/components/StatusPill";
import StatCard from "@/components/StatCard";
import { RETURN_ROWS } from "@/lib/mock-data";

export default function ReturnsPage() {
  const [mall, setMall] = useState<MallFilter>("all");

  const rows = useMemo(
    () => RETURN_ROWS.filter((r) => mall === "all" || r.mall === mall),
    [mall],
  );

  const inProgressCount = rows.filter((r) => r.status === "처리중").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">반품 고객 리스트</h1>
          <p className="text-sm text-zinc-500">반품 신청 및 처리 현황</p>
        </div>
        <MallTabs value={mall} onChange={setMall} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="반품 건수" value={`${rows.length}건`} />
        <StatCard label="처리중" value={`${inProgressCount}건`} />
        <StatCard label="완료" value={`${rows.length - inProgressCount}건`} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">주문번호</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">몰</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">고객명</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">상품명</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">반품사유</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">신청일</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">처리상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.orderNo} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-zinc-600">{r.orderNo}</td>
                <td className="px-4 py-3"><MallBadge mall={r.mall} /></td>
                <td className="px-4 py-3">{r.customerName}</td>
                <td className="px-4 py-3">{r.productName}</td>
                <td className="px-4 py-3 text-zinc-600">{r.reason}</td>
                <td className="px-4 py-3 text-zinc-600">{r.requestedAt}</td>
                <td className="px-4 py-3"><StatusPill status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
