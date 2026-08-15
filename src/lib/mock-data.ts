import type { MallId } from "./malls";

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
