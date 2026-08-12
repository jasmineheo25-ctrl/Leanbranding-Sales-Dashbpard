import { CAFE24_MALL_ID, cafe24BaseUrl } from "./config";
import { getValidAccessToken } from "./oauth";

export async function cafe24Get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const accessToken = await getValidAccessToken();

  const url = new URL(`${cafe24BaseUrl(CAFE24_MALL_ID)}/api/v2/admin${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Cafe24 API error: ${res.status} ${await res.text()}`);
  }

  return res.json();
}
