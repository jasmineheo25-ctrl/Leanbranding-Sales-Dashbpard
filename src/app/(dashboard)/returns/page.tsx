import MallBadge from "@/components/MallBadge";
import StatusPill from "@/components/StatusPill";
import StatCard from "@/components/StatCard";
import { fetchReturnOrders, RETURN_STATUS_CODES, type Cafe24OrderItem } from "@/lib/cafe24/orders";

interface ReturnRow {
  orderId: string;
  orderDate: string;
  customerName: string;
  productName: string;
  reason: string;
  status: string;
  complete: boolean;
}

const COMPLETE_CODES = new Set(["R40", "R41", "R42", "R43"]);

function toRows(orders: Awaited<ReturnType<typeof fetchReturnOrders>>): ReturnRow[] {
  const rows: ReturnRow[] = [];
  for (const order of orders) {
    const returnedItems = (order.items ?? []).filter((i: Cafe24OrderItem) =>
      RETURN_STATUS_CODES.includes(i.order_status),
    );
    for (const item of returnedItems) {
      rows.push({
        orderId: order.order_id,
        orderDate: (order.return_confirmed_date ?? order.order_date).slice(0, 10),
        customerName: order.billing_name,
        productName: item.product_name,
        reason: item.claim_reason ?? "-",
        status: item.status_text,
        complete: COMPLETE_CODES.has(item.order_status),
      });
    }
  }
  return rows;
}

export default async function ReturnsPage() {
  let orders: Awaited<ReturnType<typeof fetchReturnOrders>> = [];
  let error: string | null = null;

  try {
    orders = await fetchReturnOrders();
  } catch (e) {
    error = e instanceof Error ? e.message : "알 수 없는 오류";
  }

  const rows = toRows(orders);
  const completeCount = rows.filter((r) => r.complete).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">반품 고객 리스트</h1>
        <p className="text-sm text-zinc-500">최근 90일 반품 신청 및 처리 현황 (leanbranding)</p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          카페24 데이터를 불러오지 못했어요: {error}
        </div>
      )}

      <p className="text-xs text-zinc-400">
        참고: 반품사유는 반품 처리 시 관리자가 직접 입력해야 기록돼요. 비어있으면(&quot;-&quot;) 처리 당시 사유를
        입력하지 않은 경우예요.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="반품 건수" value={`${rows.length}건`} />
        <StatCard label="처리중" value={`${rows.length - completeCount}건`} />
        <StatCard label="완료" value={`${completeCount}건`} />
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
            {rows.map((r, i) => (
              <tr key={`${r.orderId}-${i}`} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-zinc-600">{r.orderId}</td>
                <td className="px-4 py-3">
                  <MallBadge mall="leanbranding" />
                </td>
                <td className="px-4 py-3">{r.customerName}</td>
                <td className="px-4 py-3">{r.productName}</td>
                <td className="px-4 py-3 text-zinc-600">{r.reason}</td>
                <td className="px-4 py-3 text-zinc-600">{r.orderDate}</td>
                <td className="px-4 py-3">
                  <StatusPill status={r.status} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && !error && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                  최근 90일간 반품이 없어요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
