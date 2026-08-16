import { fetchOrdersForPurchaseOrders } from "@/lib/cafe24/orders";
import { getSentItemCodes } from "@/lib/po-sent";
import { getSuppliers } from "@/lib/suppliers";
import PurchaseOrdersClient, { type SupplierGroup } from "./PurchaseOrdersClient";

async function buildGroups(): Promise<SupplierGroup[]> {
  const [orders, sentCodes, suppliers] = await Promise.all([
    fetchOrdersForPurchaseOrders(),
    getSentItemCodes(),
    getSuppliers(),
  ]);

  const groups = new Map<string, SupplierGroup>();

  for (const order of orders) {
    for (const item of order.items ?? []) {
      if (!item.supplier_id || item.order_status.startsWith("C")) continue;

      const receiver = order.receivers?.find((r) => r.shipping_code === item.shipping_code);

      if (!groups.has(item.supplier_id)) {
        groups.set(item.supplier_id, {
          supplierId: item.supplier_id,
          supplierName: item.supplier_name,
          email: suppliers.get(item.supplier_id)?.email ?? "",
          items: [],
        });
      }

      groups.get(item.supplier_id)!.items.push({
        orderId: order.order_id,
        orderItemCode: item.order_item_code,
        productName: item.product_name,
        optionValue: item.option_value,
        quantity: item.quantity,
        orderedAt: order.order_date.slice(0, 10),
        alreadySent: sentCodes.has(item.order_item_code),
        receiverName: receiver?.name ?? "-",
        receiverPhone: receiver?.cellphone ?? "-",
        receiverAddress: receiver ? `(${receiver.zipcode}) ${receiver.address_full}` : "-",
        shippingMessage: receiver?.shipping_message ?? "",
      });
    }
  }

  return [...groups.values()].sort((a, b) => a.supplierName.localeCompare(b.supplierName, "ko"));
}

export default async function PurchaseOrdersPage() {
  let groups: SupplierGroup[] = [];
  let error: string | null = null;

  try {
    groups = await buildGroups();
  } catch (e) {
    error = e instanceof Error ? e.message : "알 수 없는 오류";
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">매출확인 - 업체발주서전달</h1>
        <p className="text-sm text-zinc-500">최근 14일 주문을 공급사별로 묶어 발주 이메일을 보내요 (leanbranding)</p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          카페24 데이터를 불러오지 못했어요: {error}
        </div>
      )}

      <PurchaseOrdersClient groups={groups} />
    </div>
  );
}
