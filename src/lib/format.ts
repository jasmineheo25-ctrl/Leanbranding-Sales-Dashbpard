export function formatPrice(price: number) {
  return `${new Intl.NumberFormat('ko-KR').format(price)}원`
}
