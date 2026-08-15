import { supabaseAdmin } from "@/lib/supabase";

export async function getSentItemCodes(): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin().from("po_sent_items").select("order_item_code");
  if (error) throw new Error(`Failed to load sent items: ${error.message}`);
  return new Set((data ?? []).map((r) => r.order_item_code));
}

export async function markItemsSent(orderItemCodes: string[], supplierId: string) {
  const rows = orderItemCodes.map((order_item_code) => ({
    order_item_code,
    supplier_id: supplierId,
    sent_at: new Date().toISOString(),
  }));

  const { error } = await supabaseAdmin().from("po_sent_items").upsert(rows);
  if (error) throw new Error(`Failed to mark items sent: ${error.message}`);
}
