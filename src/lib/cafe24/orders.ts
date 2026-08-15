import { cafe24Get } from "./client";

export interface Cafe24OrderItem {
  order_item_code: string;
  product_name: string;
  quantity: number;
  product_price: string;
  supplier_id: string;
  supplier_name: string;
  order_status: string;
  status_text: string;
  claim_code: string | null;
  claim_reason: string | null;
}

export interface Cafe24Order {
  order_id: string;
  order_date: string;
  billing_name: string;
  bank_code_name: string | null;
  bank_account_no: string | null;
  payment_method: string[];
  payment_amount: string;
  initial_order_amount: { payment_amount: string; total_amount_due: string };
  paid: "T" | "F";
  canceled: "T" | "F";
  return_confirmed_date: string | null;
  items?: Cafe24OrderItem[];
}

interface OrdersResponse {
  orders: Cafe24Order[];
}

export const RETURN_STATUS_CODES = [
  "R00",
  "R10",
  "R11",
  "R12",
  "R13",
  "R20",
  "R30",
  "R31",
  "R34",
  "R36",
  "R40",
  "R41",
  "R42",
  "R43",
];

function dateRange(days: number) {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { start_date: fmt(start), end_date: fmt(end) };
}

export async function fetchSalesOrders(): Promise<Cafe24Order[]> {
  const data = await cafe24Get<OrdersResponse>("/orders", {
    ...dateRange(30),
    embed: "items",
    limit: "100",
  });
  return data.orders;
}

export async function fetchBankTransferOrders(): Promise<Cafe24Order[]> {
  const data = await cafe24Get<OrdersResponse>("/orders", {
    ...dateRange(30),
    payment_method: "cash",
    limit: "100",
  });
  return data.orders;
}

export async function fetchReturnOrders(): Promise<Cafe24Order[]> {
  const data = await cafe24Get<OrdersResponse>("/orders", {
    ...dateRange(90),
    order_status: RETURN_STATUS_CODES.join(","),
    embed: "items",
    limit: "100",
  });
  return data.orders;
}

export async function fetchOrdersForPurchaseOrders(): Promise<Cafe24Order[]> {
  const data = await cafe24Get<OrdersResponse>("/orders", {
    ...dateRange(14),
    embed: "items",
    limit: "100",
  });
  return data.orders;
}
