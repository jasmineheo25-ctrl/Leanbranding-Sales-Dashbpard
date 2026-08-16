import { supabaseAdmin } from "@/lib/supabase";

export interface SettlementRecord {
  month: string;
  fee: number;
  settled_amount: number;
  status: "정산완료" | "정산대기";
  memo: string | null;
}

export async function getSettlementRecords(): Promise<Map<string, SettlementRecord>> {
  const { data, error } = await supabaseAdmin()
    .from("settlements")
    .select("month, fee, settled_amount, status, memo");

  if (error) throw new Error(`Failed to load settlements: ${error.message}`);

  const map = new Map<string, SettlementRecord>();
  for (const row of data ?? []) {
    map.set(row.month, row as SettlementRecord);
  }
  return map;
}

export async function saveSettlementRecord(record: SettlementRecord) {
  const { error } = await supabaseAdmin()
    .from("settlements")
    .upsert({ ...record, updated_at: new Date().toISOString() });

  if (error) throw new Error(`Failed to save settlement: ${error.message}`);
}
