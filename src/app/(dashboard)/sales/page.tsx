import MallBadge from "@/components/MallBadge";
import StatusPill from "@/components/StatusPill";
import StatCard from "@/components/StatCard";
import { fetchSalesOrders } from "@/lib/cafe24/orders";
import { formatWon } from "@/lib/format";

function itemsSummary(items: { product_name: string }[] | undefined) {
  if (!items || items.length === 0) return "-";
  return items.length > 1 ? `${items[0].product_name} 외 ${items.length - 1}건` : items[0].product_name;
}

function itemsQty(items: { quantity: number }[] | undefined) {
  return items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
}

function orderStatusLabel(order: Awaited<ReturnType<typeof fetchSalesOrders>>[number]) {
  if (order.canceled === "T") return "취소";
  if (order.items?.[0]?.status_text) return order.items[0].status_text;
  return order.paid === "T" ? "결제완료" : "입금대기";
}

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">매출확인</h1>
        <p className="text-sm text-zinc-500">최근 30일 주문 및 매출 현황 (leanbranding)</p>
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

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">주문번호</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">몰</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">주문일</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">상품명</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">수량</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">결제금액</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.order_id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-zinc-600">{o.order_id}</td>
                <td className="px-4 py-3">
                  <MallBadge mall="leanbranding" />
                </td>
                <td className="px-4 py-3 text-zinc-600">{o.order_date.slice(0, 10)}</td>
                <td className="px-4 py-3">{itemsSummary(o.items)}</td>
                <td className="px-4 py-3">{itemsQty(o.items)}</td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">{formatWon(o.payment_amount)}</td>
                <td className="px-4 py-3">
                  <StatusPill status={orderStatusLabel(o)} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && !error && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                  최근 30일간 주문이 없어요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
