"use client";

import { useMemo, useState } from "react";
import MallTabs, { type MallFilter } from "@/components/MallTabs";
import MallBadge from "@/components/MallBadge";
import StatusPill from "@/components/StatusPill";
import StatCard from "@/components/StatCard";
import { PURCHASE_ORDER_ROWS } from "@/lib/mock-data";

export default function PurchaseOrdersPage() {
  const [mall, setMall] = useState<MallFilter>("all");

  const rows = useMemo(
    () => PURCHASE_ORDER_ROWS.filter((r) => mall === "all" || r.mall === mall),
    [mall],
  );

  const pendingCount = rows.filter((r) => r.deliveryStatus === "미전달").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">매출확인 - 업체발주서전달</h1>
          <p className="text-sm text-zinc-500">매출 기반 업체 발주서 전달 현황</p>
        </div>
        <MallTabs value={mall} onChange={setMall} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="발주 건수" value={`${rows.length}건`} />
        <StatCard label="미전달 건수" value={`${pendingCount}건`} hint="업체에 아직 전달되지 않음" />
        <StatCard label="전달 완료율" value={rows.length ? `${Math.round(((rows.length - pendingCount) / rows.length) * 100)}%` : "-"} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">발주번호</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">몰</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">업체명</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">상품명</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">수량</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">발주일</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">전달상태</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.poNo} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-zinc-600">{r.poNo}</td>
                <td className="px-4 py-3"><MallBadge mall={r.mall} /></td>
                <td className="px-4 py-3">{r.vendor}</td>
                <td className="px-4 py-3">{r.productName}</td>
                <td className="px-4 py-3">{r.qty}</td>
                <td className="px-4 py-3 text-zinc-600">{r.orderedAt}</td>
                <td className="px-4 py-3"><StatusPill status={r.deliveryStatus} /></td>
                <td className="px-4 py-3">
                  {r.deliveryStatus === "미전달" && (
                    <button className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
                      발주서 전달
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
