import { CAFE24_MALL_ID, cafe24BaseUrl } from "./config";
import { getValidAccessToken } from "./oauth";

// Cafe24 allows 40 requests/sec. Keep a sliding-window log of recent request
// timestamps (module scope — lives for the process/invocation) and pause
// just long enough to stay under a safe ceiling, rather than a flat delay
// that's slower than necessary when traffic is light.
const WINDOW_MS = 1000;
const MAX_PER_WINDOW = 30;
const requestTimestamps: number[] = [];

async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  while (requestTimestamps.length && now - requestTimestamps[0] > WINDOW_MS) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= MAX_PER_WINDOW) {
    const waitMs = WINDOW_MS - (now - requestTimestamps[0]) + 10;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    return waitForRateLimit();
  }

  requestTimestamps.push(now);
}

export async function cafe24Get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const accessToken = await getValidAccessToken();

  const url = new URL(`${cafe24BaseUrl(CAFE24_MALL_ID)}/api/v2/admin${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  await waitForRateLimit();

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
