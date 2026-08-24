import MallBadge from "@/components/MallBadge";
import StatCard from "@/components/StatCard";
import { fetchSalesOrders, groupByDateAndSupplier } from "@/lib/cafe24/orders";
import { formatWon } from "@/lib/format";

export default async function SalesPage() {
  let orders: Awaited<ReturnType<typeof fetchSalesOrders>> = [];
  let error: string | null = null;

  try {
    orders = await fetchSalesOrders();
  } catch (e) {
    error = e instanceof Error ? e.message : "알 수 없는 오류";
  }

  const activeOrders = orders.filter((o) => o.canceled !== "T");
  const totalPaid = activeOrders.reduce((sum, o) => sum + parseFloat(o.payment_amount), 0);
  const cancelCount = orders.filter((o) => o.canceled === "T").length;
  const days = groupByDateAndSupplier(orders);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">매출확인</h1>
        <p className="text-sm text-zinc-500">최근 30일 일자별·브랜드별 매출 현황 (leanbranding)</p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          카페24 데이터를 불러오지 못했어요: {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="주문 건수" value={`${orders.length}건`} />
        <StatCard label="결제 금액 합계" value={formatWon(totalPaid)} />
        <StatCard label="취소 건수" value={`${cancelCount}건`} />
      </div>

      <div className="flex flex-col gap-4">
        {days.map((day) => (
          <div key={day.date} className="rounded-xl border border-zinc-200 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <p className="font-medium text-zinc-900">{day.date}</p>
                <MallBadge mall="leanbranding" />
              </div>
              <p className="text-sm font-medium text-zinc-700">{formatWon(day.totalSales)}</p>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 text-left text-zinc-500">
                <tr>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">브랜드</th>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">수량</th>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">매출</th>
                </tr>
              </thead>
              <tbody>
                {day.brands.map((b) => (
                  <tr key={b.supplierId} className="border-b border-zinc-50 last:border-0">
                    <td className="px-4 py-2">{b.supplierName}</td>
                    <td className="px-4 py-2">{b.itemCount}</td>
                    <td className="px-4 py-2 font-medium whitespace-nowrap">{formatWon(b.totalSales)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {days.length === 0 && !error && (
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-400">
            최근 30일간 주문이 없어요.
          </div>
        )}
      </div>
    </div>
  );
}
