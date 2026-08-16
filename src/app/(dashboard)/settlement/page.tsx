import { fetchMonthlySupplierSales } from "@/lib/cafe24/orders";
import { getSettlementStatuses } from "@/lib/settlement-status";
import { getSuppliers } from "@/lib/suppliers";
import SettlementClient, { type MonthSettlement } from "./SettlementClient";

// Paginating a few months of a high-volume store's orders can take a while
// even with request throttling — give this route more room than the default.
export const maxDuration = 60;

function lastMonths(count: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    months.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

async function buildMonths(): Promise<MonthSettlement[]> {
  const months = lastMonths(3);
  const [suppliers, statuses] = await Promise.all([getSuppliers(), getSettlementStatuses()]);

  const monthlySales = await Promise.all(months.map((month) => fetchMonthlySupplierSales(month)));

  return months.map((month, i) => ({
    month,
    suppliers: monthlySales[i].map((s) => {
      const supplier = suppliers.get(s.supplierId);
      const status = statuses.get(`${month}:${s.supplierId}`);
      const commissionRate = supplier?.commission_rate ?? 0;
      const fee = s.totalSales * (commissionRate / 100);

      return {
        supplierId: s.supplierId,
        supplierName: s.supplierName,
        email: supplier?.email ?? "",
        totalSales: s.totalSales,
        itemCount: s.itemCount,
        commissionRate,
        fee,
        settledAmount: s.totalSales - fee,
        status: status?.status ?? "정산대기",
        memo: status?.memo ?? "",
      };
    }),
  }));
}

export default async function SettlementPage() {
  let months: MonthSettlement[] = [];
  let error: string | null = null;

  try {
    months = await buildMonths();
  } catch (e) {
    error = e instanceof Error ? e.message : "알 수 없는 오류";
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">정산</h1>
        <p className="text-sm text-zinc-500">
          공급사별 매출은 카페24 실주문에서 자동 계산돼요 (leanbranding). 공급사마다 수수료율(%)을 입력해두면
          수수료·정산금액이 자동 계산돼요.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          카페24 데이터를 불러오지 못했어요: {error}
        </div>
      )}

      <SettlementClient months={months} />
    </div>
  );
}
