import { supabaseAdmin } from "@/lib/supabase";

export interface SupplierRow {
  supplier_id: string;
  supplier_name: string;
  email: string | null;
}

export async function getSupplierEmails(): Promise<Map<string, string>> {
  const { data, error } = await supabaseAdmin().from("suppliers").select("supplier_id, email");
  if (error) throw new Error(`Failed to load suppliers: ${error.message}`);

  const map = new Map<string, string>();
  for (const row of data ?? []) {
    if (row.email) map.set(row.supplier_id, row.email);
  }
  return map;
}

export async function saveSupplierEmail(supplierId: string, supplierName: string, email: string) {
  const { error } = await supabaseAdmin()
    .from("suppliers")
    .upsert({ supplier_id: supplierId, supplier_name: supplierName, email, updated_at: new Date().toISOString() });

  if (error) throw new Error(`Failed to save supplier email: ${error.message}`);
}
