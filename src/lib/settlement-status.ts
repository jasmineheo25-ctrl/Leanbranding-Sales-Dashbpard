import { supabaseAdmin } from "@/lib/supabase";

export interface SettlementStatusRow {
  month: string;
  supplier_id: string;
  status: "정산완료" | "정산대기";
  memo: string | null;
}

export async function getSettlementStatuses(): Promise<Map<string, SettlementStatusRow>> {
  const { data, error } = await supabaseAdmin()
    .from("settlement_status")
    .select("month, supplier_id, status, memo");

  if (error) throw new Error(`Failed to load settlement status: ${error.message}`);

  const map = new Map<string, SettlementStatusRow>();
  for (const row of data ?? []) {
    map.set(`${row.month}:${row.supplier_id}`, row as SettlementStatusRow);
  }
  return map;
}

export async function saveSettlementStatus(row: SettlementStatusRow) {
  const { error } = await supabaseAdmin()
    .from("settlement_status")
    .upsert({ ...row, updated_at: new Date().toISOString() });

  if (error) throw new Error(`Failed to save settlement status: ${error.message}`);
}
