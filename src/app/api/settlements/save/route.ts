import { NextRequest, NextResponse } from "next/server";
import { saveSettlementRecord, type SettlementRecord } from "@/lib/settlements";

export async function POST(request: NextRequest) {
  const body: SettlementRecord = await request.json();

  if (!body.month || (body.status !== "정산완료" && body.status !== "정산대기")) {
    return NextResponse.json({ error: "필수 값이 없어요." }, { status: 400 });
  }

  try {
    await saveSettlementRecord(body);
  } catch (e) {
    const message = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
