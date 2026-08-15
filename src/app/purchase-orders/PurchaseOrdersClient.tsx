"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import StatusPill from "@/components/StatusPill";

export interface SupplierItem {
  orderId: string;
  orderItemCode: string;
  productName: string;
  quantity: number;
  orderedAt: string;
  alreadySent: boolean;
}

export interface SupplierGroup {
  supplierId: string;
  supplierName: string;
  email: string;
  items: SupplierItem[];
}

function SupplierCard({ group }: { group: SupplierGroup }) {
  const [email, setEmail] = useState(group.email);
  const [sentCodes, setSentCodes] = useState<Set<string>>(
    new Set(group.items.filter((i) => i.alreadySent).map((i) => i.orderItemCode)),
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unsent = group.items.filter((i) => !sentCodes.has(i.orderItemCode));

  async function handleSend() {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/purchase-orders/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: group.supplierId,
          supplierName: group.supplierName,
          email,
          items: unsent.map((i) => ({
            orderId: i.orderId,
            orderItemCode: i.orderItemCode,
            productName: i.productName,
            quantity: i.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `전송 실패 (${res.status})`);
      }

      setSentCodes(new Set(group.items.map((i) => i.orderItemCode)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
        <div>
          <p className="font-medium text-zinc-900">{group.supplierName}</p>
          <p className="text-xs text-zinc-400">미전달 {unsent.length}건 / 전체 {group.items.length}건</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="업체 이메일 입력"
            className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={sending || unsent.length === 0}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-40"
          >
            {sending ? "전송 중..." : "발주서 전달"}
          </button>
        </div>
      </div>

      {error && <div className="px-4 py-2 text-xs text-red-600">{error}</div>}

      <table className="w-full text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-zinc-500">
          <tr>
            <th className="px-4 py-2 font-medium whitespace-nowrap">주문번호</th>
            <th className="px-4 py-2 font-medium whitespace-nowrap">상품명</th>
            <th className="px-4 py-2 font-medium whitespace-nowrap">수량</th>
            <th className="px-4 py-2 font-medium whitespace-nowrap">주문일</th>
            <th className="px-4 py-2 font-medium whitespace-nowrap">전달상태</th>
          </tr>
        </thead>
        <tbody>
          {group.items.map((item) => (
            <tr key={item.orderItemCode} className="border-b border-zinc-100 last:border-0">
              <td className="px-4 py-2 font-mono text-xs text-zinc-600">{item.orderId}</td>
              <td className="px-4 py-2">{item.productName}</td>
              <td className="px-4 py-2">{item.quantity}</td>
              <td className="px-4 py-2 text-zinc-600">{item.orderedAt}</td>
              <td className="px-4 py-2">
                <StatusPill status={sentCodes.has(item.orderItemCode) ? "전달완료" : "미전달"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PurchaseOrdersClient({ groups }: { groups: SupplierGroup[] }) {
  const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);
  const unsentItems = groups.reduce((sum, g) => sum + g.items.filter((i) => !i.alreadySent).length, 0);
  const rate = totalItems ? Math.round(((totalItems - unsentItems) / totalItems) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="발주 대상 품목" value={`${totalItems}건`} />
        <StatCard label="미전달 건수" value={`${unsentItems}건`} hint="업체에 아직 전달되지 않음" />
        <StatCard label="전달 완료율" value={`${rate}%`} />
      </div>

      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <SupplierCard key={group.supplierId} group={group} />
        ))}
        {groups.length === 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-400">
            최근 14일간 발주 대상 주문이 없어요.
          </div>
        )}
      </div>
    </div>
  );
}
