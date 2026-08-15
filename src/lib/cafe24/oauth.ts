import {
  CAFE24_CLIENT_ID,
  CAFE24_CLIENT_SECRET,
  CAFE24_MALL_ID,
  CAFE24_REDIRECT_URI,
  CAFE24_SCOPES,
  cafe24BaseUrl,
} from "./config";
import { getTokens, saveTokens, type Cafe24TokenRow } from "./tokens";

interface TokenResponse {
  access_token: string;
  expires_at: string;
  refresh_token: string;
  refresh_token_expires_at: string;
  mall_id: string;
}

function basicAuthHeader() {
  return "Basic " + Buffer.from(`${CAFE24_CLIENT_ID}:${CAFE24_CLIENT_SECRET}`).toString("base64");
}

export function getAuthorizeUrl(state: string) {
  const url = new URL(`${cafe24BaseUrl(CAFE24_MALL_ID)}/api/v2/oauth/authorize`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", CAFE24_CLIENT_ID);
  url.searchParams.set("state", state);
  url.searchParams.set("redirect_uri", CAFE24_REDIRECT_URI);
  url.searchParams.set("scope", CAFE24_SCOPES.join(" "));
  return url.toString();
}

export async function exchangeCodeForTokens(code: string): Promise<void> {
  const res = await fetch(`${cafe24BaseUrl(CAFE24_MALL_ID)}/api/v2/oauth/token`, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: CAFE24_REDIRECT_URI,
    }),
  });

  if (!res.ok) {
    throw new Error(`Cafe24 token exchange failed: ${res.status} ${await res.text()}`);
  }

  const data: TokenResponse = await res.json();
  await saveTokens(toRow(data));
}

async function refreshTokens(refreshToken: string): Promise<Cafe24TokenRow> {
  const res = await fetch(`${cafe24BaseUrl(CAFE24_MALL_ID)}/api/v2/oauth/token`, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error(`Cafe24 token refresh failed: ${res.status} ${await res.text()}`);
  }

  const data: TokenResponse = await res.json();
  const row = toRow(data);
  await saveTokens(row);
  return row;
}

// Cafe24 returns expires_at/refresh_token_expires_at as naive timestamps in
// KST (Asia/Seoul, UTC+9) with no offset marker — tag them explicitly so
// they're stored and compared correctly against UTC "now".
function asKstIso(naiveTimestamp: string): string {
  return `${naiveTimestamp}+09:00`;
}

function toRow(data: TokenResponse): Cafe24TokenRow {
  return {
    mall_id: data.mall_id,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: asKstIso(data.expires_at),
    refresh_token_expires_at: asKstIso(data.refresh_token_expires_at),
  };
}

const REFRESH_MARGIN_MS = 5 * 60 * 1000;

export async function getValidAccessToken(): Promise<string> {
  const tokens = await getTokens(CAFE24_MALL_ID);
  if (!tokens) {
    throw new Error("Cafe24 not connected yet — visit /api/cafe24/connect first.");
  }

  const expiresAt = new Date(tokens.expires_at).getTime();
  if (Date.now() < expiresAt - REFRESH_MARGIN_MS) {
    return tokens.access_token;
  }

  const refreshed = await refreshTokens(tokens.refresh_token);
  return refreshed.access_token;
}
