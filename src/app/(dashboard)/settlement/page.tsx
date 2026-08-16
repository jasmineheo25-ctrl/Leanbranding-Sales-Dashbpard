import { fetchMonthlySalesSummary } from "@/lib/cafe24/orders";
import { getSettlementRecords } from "@/lib/settlements";
import SettlementClient, { type SettlementRow } from "./SettlementClient";

function lastMonths(count: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    months.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

async function buildRows(): Promise<SettlementRow[]> {
  const months = lastMonths(6);
  const records = await getSettlementRecords();

  const rows: SettlementRow[] = [];
  for (const month of months) {
    const summary = await fetchMonthlySalesSummary(month);
    const record = records.get(month);
    rows.push({
      month,
      totalSales: summary.totalSales,
      orderCount: summary.orderCount,
      fee: record?.fee ?? 0,
      settledAmount: record?.settled_amount ?? 0,
      status: record?.status ?? "정산대기",
      memo: record?.memo ?? "",
    });
  }

  return rows;
}

export default async function SettlementPage() {
  let rows: SettlementRow[] = [];
  let error: string | null = null;

  try {
    rows = await buildRows();
  } catch (e) {
    error = e instanceof Error ? e.message : "알 수 없는 오류";
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">정산</h1>
        <p className="text-sm text-zinc-500">
          총매출은 카페24 실주문에서 자동 계산돼요 (leanbranding). 수수료·정산금액은 PG사 정산서를 보고 직접
          입력해주세요 — 카페24 API로는 제공되지 않아요.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          카페24 데이터를 불러오지 못했어요: {error}
        </div>
      )}

      <SettlementClient rows={rows} />
    </div>
  );
}
