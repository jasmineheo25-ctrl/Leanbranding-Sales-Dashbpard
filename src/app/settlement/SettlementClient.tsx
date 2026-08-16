"use client";

import { useState } from "react";
import MallBadge from "@/components/MallBadge";
import StatusPill from "@/components/StatusPill";
import StatCard from "@/components/StatCard";
import { formatWon } from "@/lib/format";

export interface SettlementRow {
  month: string;
  totalSales: number;
  orderCount: number;
  fee: number;
  settledAmount: number;
  status: "정산완료" | "정산대기";
  memo: string;
}

function SettlementRowCard({ row }: { row: SettlementRow }) {
  const [fee, setFee] = useState(String(row.fee));
  const [settledAmount, setSettledAmount] = useState(String(row.settledAmount));
  const [status, setStatus] = useState(row.status);
  const [memo, setMemo] = useState(row.memo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/settlements/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: row.month,
          fee: Number(fee) || 0,
          settled_amount: Number(settledAmount) || 0,
          status,
          memo,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `저장 실패 (${res.status})`);
      }
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="font-medium text-zinc-900">{row.month}</p>
          <MallBadge mall="leanbranding" />
          <StatusPill status={status} />
        </div>
        <p className="text-xs text-zinc-400">
          총매출 {formatWon(row.totalSales)} ({row.orderCount}건, 카페24 자동 계산)
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs text-zinc-500">
          수수료
          <input
            type="number"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="rounded-md border border-zinc-200 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-500">
          정산금액
          <input
            type="number"
            value={settledAmount}
            onChange={(e) => setSettledAmount(e.target.value)}
            className="rounded-md border border-zinc-200 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-500">
          상태
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "정산완료" | "정산대기")}
            className="rounded-md border border-zinc-200 px-2 py-1.5 text-sm"
          >
            <option value="정산대기">정산대기</option>
            <option value="정산완료">정산완료</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-500">
          메모
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="선택 입력"
            className="rounded-md border border-zinc-200 px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-40"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
        {saved && <span className="text-xs text-emerald-600">저장됨</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </div>
  );
}

export default function SettlementClient({ rows }: { rows: SettlementRow[] }) {
  const totalSettled = rows.reduce((sum, r) => sum + r.settledAmount, 0);
  const totalFee = rows.reduce((sum, r) => sum + r.fee, 0);
  const pendingCount = rows.filter((r) => r.status === "정산대기").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="정산 금액 합계" value={formatWon(totalSettled)} hint="직접 입력한 값의 합" />
        <StatCard label="수수료 합계" value={formatWon(totalFee)} hint="직접 입력한 값의 합" />
        <StatCard label="정산 대기" value={`${pendingCount}건`} />
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <SettlementRowCard key={row.month} row={row} />
        ))}
      </div>
    </div>
  );
}
