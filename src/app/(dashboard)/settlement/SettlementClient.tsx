"use client";

import { useState } from "react";
import MallBadge from "@/components/MallBadge";
import StatusPill from "@/components/StatusPill";
import StatCard from "@/components/StatCard";
import { formatWon } from "@/lib/format";

export interface SupplierSettlement {
  supplierId: string;
  supplierName: string;
  email: string;
  totalSales: number;
  itemCount: number;
  commissionRate: number;
  fee: number;
  settledAmount: number;
  status: "정산완료" | "정산대기";
  memo: string;
}

export interface MonthSettlement {
  month: string;
  suppliers: SupplierSettlement[];
}

function SupplierSettlementRow({ month, row }: { month: string; row: SupplierSettlement }) {
  const [commissionRate, setCommissionRate] = useState(String(row.commissionRate));
  const [status, setStatus] = useState(row.status);
  const [memo, setMemo] = useState(row.memo);
  const [email, setEmail] = useState(row.email);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const rate = Number(commissionRate) || 0;
  const fee = row.totalSales * (rate / 100);
  const settledAmount = row.totalSales - fee;

  async function persist() {
    const commissionRes = await fetch("/api/suppliers/commission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierId: row.supplierId,
        supplierName: row.supplierName,
        commissionRate: rate,
      }),
    });
    if (!commissionRes.ok) {
      const body = await commissionRes.json().catch(() => ({}));
      throw new Error(body.error ?? `수수료율 저장 실패 (${commissionRes.status})`);
    }

    const statusRes = await fetch("/api/settlements/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, supplier_id: row.supplierId, status, memo }),
    });
    if (!statusRes.ok) {
      const body = await statusRes.json().catch(() => ({}));
      throw new Error(body.error ?? `상태 저장 실패 (${statusRes.status})`);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await persist();
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setSaving(false);
    }
  }

  async function handleSendEmail() {
    if (!email) {
      setSendError("이메일을 입력해주세요.");
      return;
    }
    setSending(true);
    setSendError(null);
    setSent(false);

    try {
      // Persist the current rate/status/memo first so what's saved always
      // matches what the supplier is being told in the email.
      await persist();

      const res = await fetch("/api/settlements/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,
          supplierId: row.supplierId,
          supplierName: row.supplierName,
          email,
          totalSales: row.totalSales,
          commissionRate: rate,
          fee,
          settledAmount,
          status,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `전송 실패 (${res.status})`);
      }
      setSent(true);
    } catch (e) {
      setSendError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="font-medium text-zinc-900">{row.supplierName}</p>
          <MallBadge mall="leanbranding" />
          <StatusPill status={status} />
        </div>
        <p className="text-xs text-zinc-400">
          매출 {formatWon(row.totalSales)} ({row.itemCount}개, 카페24 자동 계산)
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <label className="flex flex-col gap-1 text-xs text-zinc-500">
          수수료율(%)
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
            className="rounded-md border border-zinc-200 px-2 py-1.5 text-sm"
          />
        </label>
        <div className="flex flex-col gap-1 text-xs text-zinc-500">
          수수료
          <p className="px-2 py-1.5 text-sm text-zinc-700">{formatWon(fee)}</p>
        </div>
        <div className="flex flex-col gap-1 text-xs text-zinc-500">
          정산금액
          <p className="px-2 py-1.5 text-sm font-medium text-zinc-900">{formatWon(settledAmount)}</p>
        </div>
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

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-40"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
        {saved && <span className="text-xs text-emerald-600">저장됨</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="공급사 이메일 (발주서와 동일)"
          className="ml-2 rounded-md border border-zinc-200 px-3 py-1.5 text-sm"
        />
        <button
          onClick={handleSendEmail}
          disabled={sending}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
        >
          {sending ? "전송 중..." : "정산서 전달"}
        </button>
        {sent && <span className="text-xs text-emerald-600">전송됨</span>}
        {sendError && <span className="text-xs text-red-600">{sendError}</span>}
      </div>
    </div>
  );
}

function MonthSection({ month }: { month: MonthSettlement }) {
  const totalSales = month.suppliers.reduce((sum, s) => sum + s.totalSales, 0);
  const totalFee = month.suppliers.reduce((sum, s) => sum + s.fee, 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900">{month.month}</h2>
        <p className="text-xs text-zinc-400">
          공급사 매출 합계 {formatWon(totalSales)} · 수수료 합계 {formatWon(totalFee)}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {month.suppliers.map((row) => (
          <SupplierSettlementRow key={row.supplierId} month={month.month} row={row} />
        ))}
        {month.suppliers.length === 0 && (
          <div className="rounded-lg border border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-400">
            이 달엔 매출이 없어요.
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettlementClient({ months }: { months: MonthSettlement[] }) {
  const allSuppliers = months.flatMap((m) => m.suppliers);
  const totalSettled = allSuppliers.reduce((sum, s) => sum + s.settledAmount, 0);
  const totalFee = allSuppliers.reduce((sum, s) => sum + s.fee, 0);
  const pendingCount = allSuppliers.filter((s) => s.status === "정산대기").length;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="정산 금액 합계" value={formatWon(totalSettled)} hint="최근 3개월, 수수료율 기반 자동계산" />
        <StatCard label="수수료 합계" value={formatWon(totalFee)} />
        <StatCard label="정산 대기" value={`${pendingCount}건`} />
      </div>

      <div className="flex flex-col gap-8">
        {months.map((month) => (
          <MonthSection key={month.month} month={month} />
        ))}
      </div>
    </div>
  );
}
