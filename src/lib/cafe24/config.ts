export const CAFE24_MALL_ID = process.env.CAFE24_MALL_ID!;
export const CAFE24_CLIENT_ID = process.env.CAFE24_CLIENT_ID!;
export const CAFE24_CLIENT_SECRET = process.env.CAFE24_CLIENT_SECRET!;
export const CAFE24_REDIRECT_URI = process.env.CAFE24_REDIRECT_URI!;

export const CAFE24_SCOPES = ["mall.read_order"];

export function cafe24BaseUrl(mallId: string) {
  return `https://${mallId}.cafe24api.com`;
}
