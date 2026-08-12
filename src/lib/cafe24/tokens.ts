import { supabaseAdmin } from "@/lib/supabase";

export interface Cafe24TokenRow {
  mall_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  refresh_token_expires_at: string;
}

export async function saveTokens(row: Cafe24TokenRow) {
  const { error } = await supabaseAdmin()
    .from("cafe24_tokens")
    .upsert({ ...row, updated_at: new Date().toISOString() });

  if (error) throw new Error(`Failed to save Cafe24 tokens: ${error.message}`);
}

export async function getTokens(mallId: string): Promise<Cafe24TokenRow | null> {
  const { data, error } = await supabaseAdmin()
    .from("cafe24_tokens")
    .select("mall_id, access_token, refresh_token, expires_at, refresh_token_expires_at")
    .eq("mall_id", mallId)
    .maybeSingle();

  if (error) throw new Error(`Failed to load Cafe24 tokens: ${error.message}`);
  return data;
}
