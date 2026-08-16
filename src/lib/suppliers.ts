import { supabaseAdmin } from "@/lib/supabase";

export interface SupplierRow {
  supplier_id: string;
  supplier_name: string;
  email: string | null;
  commission_rate: number;
}

export async function getSuppliers(): Promise<Map<string, SupplierRow>> {
  const { data, error } = await supabaseAdmin()
    .from("suppliers")
    .select("supplier_id, supplier_name, email, commission_rate");

  if (error) throw new Error(`Failed to load suppliers: ${error.message}`);

  const map = new Map<string, SupplierRow>();
  for (const row of data ?? []) {
    map.set(row.supplier_id, row as SupplierRow);
  }
  return map;
}

export async function saveSupplierEmail(supplierId: string, supplierName: string, email: string) {
  const { error } = await supabaseAdmin()
    .from("suppliers")
    .upsert({ supplier_id: supplierId, supplier_name: supplierName, email, updated_at: new Date().toISOString() });

  if (error) throw new Error(`Failed to save supplier email: ${error.message}`);
}

export async function saveSupplierCommission(supplierId: string, supplierName: string, commissionRate: number) {
  const { error } = await supabaseAdmin().from("suppliers").upsert({
    supplier_id: supplierId,
    supplier_name: supplierName,
    commission_rate: commissionRate,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(`Failed to save commission rate: ${error.message}`);
}

export interface BulkSupplierRow {
  supplier_id: string;
  supplier_name: string;
  email: string;
  commission_rate: number;
}

export async function bulkUpsertSuppliers(rows: BulkSupplierRow[]) {
  const now = new Date().toISOString();
  const { error } = await supabaseAdmin()
    .from("suppliers")
    .upsert(rows.map((r) => ({ ...r, updated_at: now })));

  if (error) throw new Error(`Failed to bulk-save suppliers: ${error.message}`);
}
