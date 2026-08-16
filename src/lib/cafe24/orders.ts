import { cafe24Get } from "./client";

export interface Cafe24OrderItem {
  order_item_code: string;
  product_name: string;
  option_value: string;
  quantity: number;
  product_price: string;
  supplier_id: string;
  supplier_name: string;
  order_status: string;
  status_text: string;
  claim_code: string | null;
  claim_reason: string | null;
  shipping_code: string;
}

export interface Cafe24Receiver {
  name: string;
  cellphone: string;
  address_full: string;
  zipcode: string;
  shipping_message: string;
  shipping_code: string;
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
  receivers?: Cafe24Receiver[];
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
    embed: "items,receivers",
    limit: "100",
  });
  return data.orders;
}

const MAX_PAGES = 20;
// Cafe24 allows 40 req/sec; stay well under that so bursts across callers don't 429.
const REQUEST_INTERVAL_MS = 60;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchAllOrders(params: Record<string, string>): Promise<Cafe24Order[]> {
  const all: Cafe24Order[] = [];
  let offset = 0;
  const limit = 100;

  for (let page = 0; page < MAX_PAGES; page++) {
    const data = await cafe24Get<OrdersResponse>("/orders", {
      ...params,
      limit: String(limit),
      offset: String(offset),
    });
    all.push(...data.orders);
    if (data.orders.length < limit) break;
    offset += limit;
    await sleep(REQUEST_INTERVAL_MS);
  }

  return all;
}

export interface SupplierMonthlySales {
  supplierId: string;
  supplierName: string;
  totalSales: number;
  itemCount: number;
}

const NON_REVENUE_PREFIXES = ["C"]; // cancellations

function isRevenueItem(item: Cafe24OrderItem): boolean {
  if (NON_REVENUE_PREFIXES.some((p) => item.order_status.startsWith(p))) return false;
  if (RETURN_STATUS_CODES.includes(item.order_status)) return false;
  return true;
}

export async function fetchMonthlySupplierSales(month: string): Promise<SupplierMonthlySales[]> {
  const [year, mon] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, mon - 1, 1));
  const end = new Date(Date.UTC(year, mon, 0));
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const orders = await fetchAllOrders({
    start_date: fmt(start),
    end_date: fmt(end),
    embed: "items",
  });

  const bySupplier = new Map<string, SupplierMonthlySales>();

  for (const order of orders) {
    for (const item of order.items ?? []) {
      if (!item.supplier_id || !isRevenueItem(item)) continue;

      if (!bySupplier.has(item.supplier_id)) {
        bySupplier.set(item.supplier_id, {
          supplierId: item.supplier_id,
          supplierName: item.supplier_name,
          totalSales: 0,
          itemCount: 0,
        });
      }

      const entry = bySupplier.get(item.supplier_id)!;
      entry.totalSales += parseFloat(item.product_price) * item.quantity;
      entry.itemCount += item.quantity;
    }
  }

  return [...bySupplier.values()].sort((a, b) => b.totalSales - a.totalSales);
}
