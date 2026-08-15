import MallBadge from "@/components/MallBadge";
import StatusPill from "@/components/StatusPill";
import StatCard from "@/components/StatCard";
import { fetchBankTransferOrders, type Cafe24Order } from "@/lib/cafe24/orders";
import { formatWon } from "@/lib/format";

function depositAmount(order: Cafe24Order): number {
  return parseFloat(order.paid === "T" ? order.payment_amount : order.initial_order_amount.total_amount_due);
}

export default async function BankTransferPage() {
  let orders: Awaited<ReturnType<typeof fetchBankTransferOrders>> = [];
  let error: string | null = null;

  try {
    orders = await fetchBankTransferOrders();
  } catch (e) {
    error = e instanceof Error ? e.message : "알 수 없는 오류";
  }

  const unconfirmed = orders.filter((o) => o.paid !== "T");
  const unconfirmedAmount = unconfirmed.reduce((sum, o) => sum + depositAmount(o), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">무통장입금 고객 리스트</h1>
        <p className="text-sm text-zinc-500">최근 30일 입금 확인이 필요한 주문 현황 (leanbranding)</p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          카페24 데이터를 불러오지 못했어요: {error}
        </div>
      )}

      <p className="text-xs text-zinc-400">
        참고: 카페24 API는 고객이 실제로 입력한 입금자명을 제공하지 않아요 (입금 계좌 정보만 제공). 입금자명 대조는
        카페24 관리자 화면에서 직접 확인해주세요.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="전체 건수" value={`${orders.length}건`} />
        <StatCard label="미확인 건수" value={`${unconfirmed.length}건`} hint="입금 확인 전" />
        <StatCard label="미확인 예정금액" value={formatWon(unconfirmedAmount)} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">주문번호</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">몰</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">주문자명</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">입금은행</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">입금예정금액</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">주문일</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">확인상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.order_id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-zinc-600">{o.order_id}</td>
                <td className="px-4 py-3">
                  <MallBadge mall="leanbranding" />
                </td>
                <td className="px-4 py-3">{o.billing_name}</td>
                <td className="px-4 py-3 text-zinc-600">{o.bank_code_name ?? "-"}</td>
                <td className="px-4 py-3">{formatWon(depositAmount(o))}</td>
                <td className="px-4 py-3 text-zinc-600">{o.order_date.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <StatusPill status={o.paid === "T" ? "확인" : "미확인"} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && !error && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                  최근 30일간 무통장입금 주문이 없어요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
