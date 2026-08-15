import type { MallId } from "./malls";

export interface PurchaseOrderRow {
  poNo: string;
  mall: MallId;
  vendor: string;
  productName: string;
  qty: number;
  orderedAt: string;
  deliveryStatus: "전달완료" | "미전달";
}

export const PURCHASE_ORDER_ROWS: PurchaseOrderRow[] = [
  { poNo: "PO-0231", mall: "leanbranding", vendor: "동대문 A상사", productName: "린넨 원피스", qty: 2, orderedAt: "2026-08-05", deliveryStatus: "전달완료" },
  { poNo: "PO-0232", mall: "leanbranding", vendor: "성수 B공방", productName: "코튼 블라우스", qty: 1, orderedAt: "2026-08-06", deliveryStatus: "미전달" },
  { poNo: "PO-0233", mall: "leanbranding", vendor: "을지로 C상사", productName: "베이직 티셔츠", qty: 3, orderedAt: "2026-08-06", deliveryStatus: "전달완료" },
  { poNo: "PO-0234", mall: "leanbranding", vendor: "동대문 A상사", productName: "와이드 팬츠", qty: 1, orderedAt: "2026-08-07", deliveryStatus: "미전달" },
];

export interface SettlementRow {
  month: string;
  mall: MallId;
  totalSales: number;
  fee: number;
  settledAmount: number;
  status: "정산완료" | "정산대기";
}

export const SETTLEMENT_ROWS: SettlementRow[] = [
  { month: "2026-06", mall: "leanbranding", totalSales: 12500000, fee: 1375000, settledAmount: 11125000, status: "정산완료" },
  { month: "2026-07", mall: "leanbranding", totalSales: 14200000, fee: 1562000, settledAmount: 12638000, status: "정산완료" },
  { month: "2026-08", mall: "leanbranding", totalSales: 3100000, fee: 341000, settledAmount: 2759000, status: "정산대기" },
];
