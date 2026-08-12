import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/cafe24/oauth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("cafe24_oauth_state")?.value;
  cookieStore.delete("cafe24_oauth_state");

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.json({ error: "Invalid OAuth state or missing code" }, { status: 400 });
  }

  await exchangeCodeForTokens(code);

  return NextResponse.redirect(new URL("/sales?cafe24=connected", request.url));
}
