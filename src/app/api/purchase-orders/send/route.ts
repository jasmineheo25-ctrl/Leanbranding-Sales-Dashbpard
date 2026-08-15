import { NextRequest, NextResponse } from "next/server";
import { sendPurchaseOrderEmail } from "@/lib/email";
import { markItemsSent } from "@/lib/po-sent";
import { saveSupplierEmail } from "@/lib/suppliers";

interface SendPayload {
  supplierId: string;
  supplierName: string;
  email: string;
  items: { orderId: string; orderItemCode: string; productName: string; quantity: number }[];
}

export async function POST(request: NextRequest) {
  const body: SendPayload = await request.json();

  if (!body.supplierId || !body.email || !body.items?.length) {
    return NextResponse.json({ error: "필수 값이 없어요." }, { status: 400 });
  }

  try {
    await saveSupplierEmail(body.supplierId, body.supplierName, body.email);
    await sendPurchaseOrderEmail(body.email, body.supplierName, body.items);
    await markItemsSent(
      body.items.map((i) => i.orderItemCode),
      body.supplierId,
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
