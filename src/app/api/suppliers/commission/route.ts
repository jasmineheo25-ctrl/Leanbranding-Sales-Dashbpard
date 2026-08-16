import { NextRequest, NextResponse } from "next/server";
import { saveSupplierCommission } from "@/lib/suppliers";

export async function POST(request: NextRequest) {
  const { supplierId, supplierName, commissionRate } = await request.json();

  if (!supplierId || typeof commissionRate !== "number" || commissionRate < 0 || commissionRate > 100) {
    return NextResponse.json({ error: "필수 값이 없거나 수수료율이 올바르지 않아요 (0~100)." }, { status: 400 });
  }

  try {
    await saveSupplierCommission(supplierId, supplierName, commissionRate);
  } catch (e) {
    const message = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
