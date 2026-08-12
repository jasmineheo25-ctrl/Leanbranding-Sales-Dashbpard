import { cafe24Get } from "./client";

export interface Cafe24Order {
  order_id: string;
  order_date: string;
  payment_amount: string;
  payment_method: string[];
  billing_name: string;
  bank_account_owner_name: string | null;
  paid: "T" | "F";
  canceled: "T" | "F";
  [key: string]: unknown;
}

interface OrdersResponse {
  orders: Cafe24Order[];
}

export async function fetchOrders(params: Record<string, string>): Promise<Cafe24Order[]> {
  const data = await cafe24Get<OrdersResponse>("/orders", params);
  return data.orders;
}
