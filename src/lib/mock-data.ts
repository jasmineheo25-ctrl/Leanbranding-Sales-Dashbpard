import type { MallId } from "./malls";

export interface SalesRow {
  orderNo: string;
  mall: MallId;
  orderDate: string;
  productName: string;
  qty: number;
  price: number;
  paidAmount: number;
  status: "결제완료" | "배송중" | "배송완료" | "취소";
}

export const SALES_ROWS: SalesRow[] = [
  { orderNo: "SR-20260805-001", mall: "srook", orderDate: "2026-08-05", productName: "린넨 원피스", qty: 2, price: 39000, paidAmount: 78000, status: "배송완료" },
  { orderNo: "SR-20260806-014", mall: "srook", orderDate: "2026-08-06", productName: "코튼 블라우스", qty: 1, price: 32000, paidAmount: 32000, status: "배송중" },
  { orderNo: "ES-20260806-007", mall: "essential", orderDate: "2026-08-06", productName: "베이직 티셔츠", qty: 3, price: 19000, paidAmount: 57000, status: "결제완료" },
  { orderNo: "ES-20260807-002", mall: "essential", orderDate: "2026-08-07", productName: "와이드 팬츠", qty: 1, price: 45000, paidAmount: 45000, status: "배송완료" },
  { orderNo: "SR-20260808-021", mall: "srook", orderDate: "2026-08-08", productName: "니트 가디건", qty: 1, price: 52000, paidAmount: 0, status: "취소" },
];

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
  { poNo: "PO-0231", mall: "srook", vendor: "동대문 A상사", productName: "린넨 원피스", qty: 2, orderedAt: "2026-08-05", deliveryStatus: "전달완료" },
  { poNo: "PO-0232", mall: "srook", vendor: "성수 B공방", productName: "코튼 블라우스", qty: 1, orderedAt: "2026-08-06", deliveryStatus: "미전달" },
  { poNo: "PO-0233", mall: "essential", vendor: "을지로 C상사", productName: "베이직 티셔츠", qty: 3, orderedAt: "2026-08-06", deliveryStatus: "전달완료" },
  { poNo: "PO-0234", mall: "essential", vendor: "동대문 A상사", productName: "와이드 팬츠", qty: 1, orderedAt: "2026-08-07", deliveryStatus: "미전달" },
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
  { month: "2026-06", mall: "srook", totalSales: 12500000, fee: 1375000, settledAmount: 11125000, status: "정산완료" },
  { month: "2026-06", mall: "essential", totalSales: 8900000, fee: 979000, settledAmount: 7921000, status: "정산완료" },
  { month: "2026-07", mall: "srook", totalSales: 14200000, fee: 1562000, settledAmount: 12638000, status: "정산완료" },
  { month: "2026-07", mall: "essential", totalSales: 9600000, fee: 1056000, settledAmount: 8544000, status: "정산대기" },
  { month: "2026-08", mall: "srook", totalSales: 3100000, fee: 341000, settledAmount: 2759000, status: "정산대기" },
];

export interface BankTransferRow {
  orderNo: string;
  mall: MallId;
  customerName: string;
  depositorName: string;
  amount: number;
  orderDate: string;
  confirmed: boolean;
}

export const BANK_TRANSFER_ROWS: BankTransferRow[] = [
  { orderNo: "SR-20260807-030", mall: "srook", customerName: "김지현", depositorName: "김지현", amount: 78000, orderDate: "2026-08-07", confirmed: true },
  { orderNo: "SR-20260808-032", mall: "srook", customerName: "이서연", depositorName: "이서연모", amount: 45000, orderDate: "2026-08-08", confirmed: false },
  { orderNo: "ES-20260808-018", mall: "essential", customerName: "박준영", depositorName: "박준영", amount: 57000, orderDate: "2026-08-08", confirmed: false },
  { orderNo: "ES-20260809-004", mall: "essential", customerName: "최민아", depositorName: "최민아", amount: 32000, orderDate: "2026-08-09", confirmed: true },
];

export interface ReturnRow {
  orderNo: string;
  mall: MallId;
  customerName: string;
  productName: string;
  reason: string;
  requestedAt: string;
  status: "처리중" | "완료";
}

export const RETURN_ROWS: ReturnRow[] = [
  { orderNo: "SR-20260801-011", mall: "srook", customerName: "정하윤", productName: "니트 가디건", reason: "사이즈 불만족", requestedAt: "2026-08-03", status: "완료" },
  { orderNo: "ES-20260802-009", mall: "essential", customerName: "한소율", productName: "와이드 팬츠", reason: "색상 상이", requestedAt: "2026-08-05", status: "처리중" },
  { orderNo: "SR-20260804-018", mall: "srook", customerName: "오지훈", productName: "코튼 블라우스", reason: "단순 변심", requestedAt: "2026-08-07", status: "처리중" },
];
