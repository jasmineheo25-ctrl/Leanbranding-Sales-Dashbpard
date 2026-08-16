import { NextRequest, NextResponse } from "next/server";
import { sendSettlementEmail } from "@/lib/email";
import { saveSupplierEmail } from "@/lib/suppliers";

interface SendPayload {
  month: string;
  supplierId: string;
  supplierName: string;
  email: string;
  totalSales: number;
  commissionRate: number;
  fee: number;
  settledAmount: number;
  status: string;
}

export async function POST(request: NextRequest) {
  const body: SendPayload = await request.json();

  if (!body.month || !body.supplierId || !body.email) {
    return NextResponse.json({ error: "필수 값이 없어요." }, { status: 400 });
  }

  try {
    await saveSupplierEmail(body.supplierId, body.supplierName, body.email);
    await sendSettlementEmail(body.email, body.supplierName, {
      month: body.month,
      totalSales: body.totalSales,
      commissionRate: body.commissionRate,
      fee: body.fee,
      settledAmount: body.settledAmount,
      status: body.status,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
