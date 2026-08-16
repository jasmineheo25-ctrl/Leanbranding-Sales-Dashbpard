import { NextRequest, NextResponse } from "next/server";
import { bulkUpsertSuppliers, type BulkSupplierRow } from "@/lib/suppliers";

export async function POST(request: NextRequest) {
  const { rows } = await request.json();

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "업로드할 행이 없어요." }, { status: 400 });
  }

  const cleaned: BulkSupplierRow[] = [];
  for (const row of rows) {
    if (!row.supplier_id) continue;
    const rate = Number(row.commission_rate);
    cleaned.push({
      supplier_id: String(row.supplier_id).trim(),
      supplier_name: String(row.supplier_name ?? "").trim(),
      email: String(row.email ?? "").trim(),
      commission_rate: Number.isFinite(rate) ? Math.min(100, Math.max(0, rate)) : 0,
    });
  }

  if (cleaned.length === 0) {
    return NextResponse.json({ error: "유효한 행이 없어요 (공급사ID 누락)." }, { status: 400 });
  }

  try {
    await bulkUpsertSuppliers(cleaned);
  } catch (e) {
    const message = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: cleaned.length });
}
