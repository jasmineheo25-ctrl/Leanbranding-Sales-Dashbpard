export function formatWon(amount: number | string): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${value.toLocaleString("ko-KR")}원`;
}
